import { run as runAirPlay } from '@/test/airplay';
import { run as runCompanionLink } from '@/test/companion-link';

const PROTOCOL: 'airplay' | 'companion-link' = 'airplay';

async function run(): Promise<void> {
    switch (PROTOCOL) {
        case 'airplay':
            await runAirPlay('pair');
            break;

        case 'companion-link':
            await runCompanionLink('pair');
            break;
    }
}

await run();
