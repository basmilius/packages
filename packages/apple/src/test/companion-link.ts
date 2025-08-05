import { CompanionLinkDevice } from '@/companion-link';
import { Discover, prompt, uuid } from '@/support';
import * as process from 'node:process';
import { FrameType, MessageType } from '@/companion-link/protocol';

const PAIRED_ACCESSORIES = {
    WOONKAMER_TV: {
        fqdn: 'Woonkamer TV._companion-link._tcp.local',
        identifier: '7EEEA518-06CC-486C-A8B8-4A07CDBE6267',
        longTermPublicKey: 'cfb3fb0e0eb494d9058d5051c94400b35251e3faad66542b9551a1496570628d',
        pairingId: 'E0:7B:87:7B:58:BE',
        privateKey: '7951fe85b09052fb548a997f2a92a8fe62ecb34c159977d0e7fa348adf4f94879b6daea3476130668c15a6289cb642102848a74a2c452b256339e301e21772bc',
        publicKey: '9b6daea3476130668c15a6289cb642102848a74a2c452b256339e301e21772bc'
    }
};

const ACCESSORY = PAIRED_ACCESSORIES.WOONKAMER_TV;

export async function run(mode: 'pair' | 'verify'): Promise<void> {
    console.debug('Discovering devices...');

    const discover = Discover.companionLink();
    const device = await discover.findUntil(ACCESSORY.fqdn);

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

    process.exit(0);
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
