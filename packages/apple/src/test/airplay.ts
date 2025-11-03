import { AirPlayDevice } from '@/airplay';
import { ACCESSORY } from '@/brain';
import { Discover, prompt } from '@/support';

export async function run(mode: 'pair' | 'verify'): Promise<void> {
    console.debug('Discovering devices...');

    const discover = Discover.airplay();
    const device = await discover.findUntil(ACCESSORY.fqdn.airplay);

    console.debug('Connecting to device: ', device.fqdn, '...');

    const airtunesdevice = new AirPlayDevice(
        device.fqdn,
        device.address,
        device.service.port,
        device.packet.additionals.find((a: any) => a.rdata && a.rdata.deviceid)?.rdata.deviceid
    );

    await airtunesdevice.connect();

    switch (mode) {
        case 'pair':
            await pair(airtunesdevice);
            break;

        case 'verify':
            await verify(airtunesdevice);
            break;
    }
}

async function pair(device: AirPlayDevice): Promise<void> {
    const transientPairing = true;

    if (transientPairing) {
        const credentials = await device.pairing.startTransientPairing();

        // console.log({
        //     pairingId: credentials.pairingId.toString(),
        //     sharedSecret: credentials.sharedSecret.toString('hex'),
        //     accessoryToControllerKey: credentials.accessoryToControllerKey.toString('hex'),
        //     controllerToAccessoryKey: credentials.controllerToAccessoryKey.toString('hex')
        // });

        device.client.enableEncryption(
            credentials.accessoryToControllerKey,
            credentials.controllerToAccessoryKey
        );

        await device.rtsp.setupEventStream(credentials.pairingId, credentials.sharedSecret);
        await device.rtsp.record();
        await device.rtsp.setupDataStream(credentials.sharedSecret);

        setInterval(async () => {
            await device.rtsp.feedback();
        }, 2000);

        // await device.rtsp.setVolume(25);
        // await device.rtsp.getVolume();

        console.log('Bye.');
    } else {
        const credentials = await device.pairing.startPinPairing(async () => await prompt('Enter PIN'));

        console.log({
            identifier: credentials.accessoryIdentifier,
            longTermPublicKey: credentials.accessoryLongTermPublicKey.toString('hex'),
            pairingId: credentials.pairingId.toString(),
            privateKey: credentials.privateKey.toString('hex'),
            publicKey: credentials.publicKey.toString('hex')
        });
    }
}

async function verify(device: AirPlayDevice): Promise<void> {
    const m4 = await device.verify.verify(ACCESSORY);

    device.client.enableEncryption(
        m4.accessoryToControllerKey,
        m4.controllerToAccessoryKey
    );

    console.log(await device.info());

    // await device.rtsp.setup(ACCESSORY.pairingId);
    // await device.rtsp.feedback();
    // await device.rtsp.record();

    // await device.rtsp.command('setProperty?name=client-expect-remote-control&value=1');
    // console.log(await device.playbackInfo());
    // await device.rtsp.command('pause');

    // console.log(await device.rtsp.getVolume());
    // await device.rtsp.setVolume(5);

    // const metadata = await device.client.write('GET_PARAMETER', `/${sessionId}`, 'metadata\r\n', {
    //     'Content-Type': 'text/parameters',
    //     'DACP-ID': dacpId,
    //     'Client-Instance': dacpId,
    //     'Active-Remote': activeRemote
    // });
    //
    // console.log({metadata, response: await metadata.text()});
    //
    // // region play doorbell.ogg
    //
    // const playPlist = serializeBinaryPlist({
    //     'Content-Location': 'https://bmcdn.nl/doorbell.ogg',
    //     'Start-Position-Seconds': 0,
    //     'uuid': uuid(),
    //     'streamType': 1,
    //     'mediaType': 'file',
    //     'mightSupportStorePastisKeyRequests': true,
    //     'playbackRestrictions': 0,
    //     'secureConnectionMs': 22,
    //     'volume': 1.0,
    //     'infoMs': 122,
    //     'connectMs': 18,
    //     'authMs': 0,
    //     'bonjourMs': 0,
    //     'referenceRestrictions': 3,
    //     'SenderMACAddress': getMacAddress(),
    //     'model': 'MacBookPro18,1',
    //     'postAuthMs': 0,
    //     'clientBundleID': 'com.basmilius.airplaysender',
    //     'clientProcName': 'com.basmilius.airplaysender',
    //     'osBuildVersion': '22E240',
    //     'rate': 1.0
    // });
    //
    // const feedback = await device.client.write('POST', '/feedback', null, {
    //     'DACP-ID': dacpId,
    //     'Active-Remote': activeRemote,
    //     'Client-Instance': dacpId
    // });
    // console.log('feedback', feedback, await feedback.arrayBuffer());
    //
    // const record = await device.client.write('RECORD', `/${sessionId}`, null, {
    //     'DACP-ID': dacpId,
    //     'Client-Instance': dacpId,
    //     'Active-Remote': activeRemote
    // });
    // console.log({record, response: await record.text()});
    //
    // const play = await device.client.write('POST', '/play', Buffer.from(playPlist), {
    //     'Content-Type': 'application/x-apple-binary-plist',
    //     'DACP-ID': dacpId,
    //     'Client-Instance': dacpId,
    //     'Active-Remote': activeRemote
    // });
    //
    // console.log({play, response: await play.text()});
}
