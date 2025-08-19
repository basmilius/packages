import * as process from 'node:process';
import { ACCESSORY } from '@/brain';
import { CompanionLinkDevice } from '@/companion-link';
import { FrameType, MessageType } from '@/companion-link/protocol';
import { Discover, prompt, uuid } from '@/support';

export async function run(mode: 'pair' | 'verify'): Promise<void> {
    console.debug('Discovering devices...');

    const discover = Discover.companionLink();
    const device = await discover.findUntil(ACCESSORY.fqdn.companionLink);

    console.debug('Connecting to device: ', device.fqdn, '...');

    const companionLinkDevice = new CompanionLinkDevice(
        device.fqdn,
        device.address,
        device.service.port,
        device.packet.additionals.find((a: any) => a.rdata && a.rdata.rpBA)?.rdata.rpBA
    );

    await companionLinkDevice.socket.connect();

    switch (mode) {
        case 'pair':
            await pair(companionLinkDevice);
            break;

        case 'verify':
            await verify(companionLinkDevice);
            break;
    }
}

async function pair(device: CompanionLinkDevice): Promise<void> {
    await device.pairing.start();
    const credentials = await device.pairing.pin(async () => await prompt('Enter PIN'));

    console.log({
        identifier: credentials.accessoryIdentifier,
        longTermPublicKey: credentials.accessoryLongTermPublicKey.toString('hex'),
        pairingId: credentials.pairingId.toString(),
        privateKey: credentials.privateKey.toString('hex'),
        publicKey: credentials.publicKey.toString('hex')
    });
}

async function verify(device: CompanionLinkDevice): Promise<void> {
    const m4 = await device.verify.verify(ACCESSORY);

    device.socket.enableEncryption(
        m4.accessoryToControllerKey,
        m4.controllerToAccessoryKey
    );

    // const [, ping] = await device.socket.send(FrameType.E_OPACK, {
    //     _i: '_ping',
    //     _t: 1,
    //     _c: { string: 'hi' }
    // });
    //
    // console.log(ping);

    const [, systemInfo] = await device.socket.send(FrameType.E_OPACK, {
        _i: '_systemInfo',
        _t: MessageType.Request,
        _c: {
            _bf: 0,
            _cf: 512,
            _clFl: 128,
            _i: ACCESSORY.identifier,
            _idsID: uuid(),
            _pubID: uuid(),
            _sf: 256,
            _sv: '170.18',
            model: 'MacBookPro18,1',
            name: 'Woonkamer TV'
        }
    });

    console.log(systemInfo);
}
