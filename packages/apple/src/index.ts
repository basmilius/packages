import { AirPlayDevice } from './airplay';
import Discover from './discover';

async function run(): Promise<void> {
    console.debug('Discovering devices...');

    const discover = Discover.airplay();
    const devices = await discover.find();

    console.debug('Found devices:');
    console.debug(devices.map(d => d.fqdn).join('\n'));

    const device = devices.find(d => d.fqdn === 'Kantoor._airplay._tcp.local');
    if (!device) {
        console.error('Device not found.');
        return;
    }

    console.debug('Connecting to device: ', device.fqdn, '...');

    const airtunesdevice = new AirPlayDevice(
        device.fqdn,
        device.address,
        device.service.port,
        device.packet.additionals.find(a => a.rdata && a.rdata.deviceid)?.rdata.deviceid
    );

    const transientPairing = true;

    await airtunesdevice.connect();

    if (transientPairing) {
        await airtunesdevice.pair();
    } else {
        await airtunesdevice.pairing.start('Bun Client');
        const m1 = await airtunesdevice.pairing.m1();

        const pin = prompt('Enter PIN');
        const m2 = await airtunesdevice.pairing.m2(m1.publicKey, m1.salt, pin);
        const m3 = await airtunesdevice.pairing.m3(m2.publicKey, m2.proof);
        const m4 = await airtunesdevice.pairing.m4(m3.serverProof);
        await airtunesdevice.pairing.m5(m4.sharedSecret);
    }
}

await run();
