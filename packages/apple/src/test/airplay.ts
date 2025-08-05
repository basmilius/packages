import process from 'node:process';
import { AirPlayDevice } from '@/airplay';
import { Discover, prompt } from '@/support';

const PAIRED_ACCESSORIES = {
    KANTOOR: {
        fqdn: 'Kantoor._airplay._tcp.local',
        identifier: 'C4:38:75:ED:54:78',
        longTermPublicKey: '8425791eb25637ed57e10173e9eeab12a74f8cc7fafac288f71d067c152ec540',
        pairingId: 'C4:38:75:ED:54:78',
        privateKey: '55eec2fe6afd915701e4587f9d6518c1a39ccc29300bd83e6612641107c7865d4b6c2ad1ca795525d24ed5c2c4a9d3f8fad252fc9ffc568fc69a2768e518ee5f',
        publicKey: '4b6c2ad1ca795525d24ed5c2c4a9d3f8fad252fc9ffc568fc69a2768e518ee5f'
    },

    SLAAPKAMER: {
        fqdn: 'Slaapkamer._airplay._tcp.local',
        identifier: 'C4:38:75:ED:54:78',
        longTermPublicKey: '8425791eb25637ed57e10173e9eeab12a74f8cc7fafac288f71d067c152ec540',
        pairingId: 'C4:38:75:ED:54:78',
        privateKey: '45e87db64d052e1b16b7303269b73b3d30bbbfd3a3dbcc10973888fe74e74b9f5077871e92fddc7f6b01c66127eae349477d060158e070f7d39ee9f7f7a4aa4d',
        publicKey: '5077871e92fddc7f6b01c66127eae349477d060158e070f7d39ee9f7f7a4aa4d'
    },

    WOONKAMER: {
        fqdn: 'Woonkamer._airplay._tcp.local',
        identifier: '38:42:0B:EC:B3:67',
        longTermPublicKey: '27a7748dbada78ac28f2415955994a24e07761a00bbd0c81d68fcb973636026e',
        pairingId: '38:42:0B:EC:B3:67',
        privateKey: '97e4538a39839eaa38352e735d291beba64ee7ce474277a37a5c3d10c800a868df927401f2703a3b48b33be427ee59f647b71e84c4a6b0316391c87313356f6d',
        publicKey: 'df927401f2703a3b48b33be427ee59f647b71e84c4a6b0316391c87313356f6d'
    },

    WOONKAMER_TV: {
        fqdn: 'Woonkamer TV._airplay._tcp.local',
        identifier: '7EEEA518-06CC-486C-A8B8-4A07CDBE6267',
        longTermPublicKey: 'cfb3fb0e0eb494d9058d5051c94400b35251e3faad66542b9551a1496570628d',
        pairingId: '7E:EE:A5:18:06:CC',
        privateKey: 'bfc77506dc91fd6803521eeac3673d643acd9ef0986664c2ef5248feef3f626ac529bdad82fb253132a353687d0d2a6c70f1438c0ee2e8fc9d55b0b801fadcf9',
        publicKey: 'c529bdad82fb253132a353687d0d2a6c70f1438c0ee2e8fc9d55b0b801fadcf9'
    }
} as const;

const ACCESSORY = PAIRED_ACCESSORIES.WOONKAMER_TV;

export async function run(mode: 'pair' | 'verify'): Promise<void> {
    console.debug('Discovering devices...');

    const discover = Discover.airplay();
    const device = await discover.findUntil(ACCESSORY.fqdn);

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

    process.exit(0);
}

async function pair(device: AirPlayDevice): Promise<void> {
    const transientPairing = false;

    await device.pairing.start('Bas Client');

    const credentials = transientPairing
        ? await device.pairing.transient()
        : await device.pairing.pin(async () => await prompt('Enter PIN'));

    console.log({
        identifier: credentials.accessoryIdentifier,
        longTermPublicKey: credentials.accessoryLongTermPublicKey.toString('hex'),
        pairingId: credentials.pairingId.toString(),
        privateKey: credentials.privateKey.toString('hex'),
        publicKey: credentials.publicKey.toString('hex')
    });
}

async function verify(device: AirPlayDevice): Promise<void> {
    const m4 = await device.verify.verify(ACCESSORY);

    device.client.enableEncryption(
        m4.accessoryToControllerKey,
        m4.controllerToAccessoryKey
    );

    console.log(await device.info());

    await device.rtsp.setup(ACCESSORY.pairingId);
    // await device.rtsp.feedback();
    // await device.rtsp.record();

    await device.rtsp.command('setProperty?name=client-expect-remote-control&value=1');
    console.log(await device.playbackInfo());
    await device.rtsp.command('pause');

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
