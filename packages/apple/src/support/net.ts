import { networkInterfaces } from 'node:os';

export function getLocalIPAddress(): string {
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        const iface = interfaces[name];

        if (!iface) {
            continue;
        }

        for (const net of iface) {
            if (net.internal || net.family !== 'IPv4') {
                continue;
            }

            if (net.address && net.address !== '127.0.0.1') {
                return net.address;
            }
        }
    }

    return null;
}

export function getMacAddress(): string {
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        const iface = interfaces[name];

        if (!iface) {
            continue;
        }

        for (const net of iface) {
            if (net.internal || net.family !== 'IPv4') {
                continue;
            }

            if (net.mac && net.mac !== '00:00:00:00:00:00') {
                return net.mac.toUpperCase();
            }
        }
    }

    return null;
}
