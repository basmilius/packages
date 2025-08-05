import { run as runAirPlay } from '@/test/airplay';
import { run as runCompanionLink } from '@/test/companion-link';

const PROTOCOL: 'airplay' | 'companion-link' = 'companion-link';

async function run(): Promise<void> {
    switch (PROTOCOL) {
        case 'airplay':
            await runAirPlay('verify');
            break;

        case 'companion-link':
            await runCompanionLink('verify');
            break;
    }
}

await run();
