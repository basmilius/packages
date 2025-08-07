const PAIRED_ACCESSORIES = {
    KANTOOR: {
        fqdn: {
            airplay: 'Kantoor._airplay._tcp.local'
        },
        identifier: 'C4:38:75:ED:54:78',
        longTermPublicKey: '8425791eb25637ed57e10173e9eeab12a74f8cc7fafac288f71d067c152ec540',
        pairingId: 'cc27762d-ad61-464e-99fb-b9eb066f25b7',
        privateKey: 'fb704d51bcb1d7d643aaa04b65b370a66c67385b9f25ab55ec389449b692259f60a2fdddb048ca6725055356579aeb7b0955bfaf56cc4a24a37d244a08476e81',
        publicKey: '60a2fdddb048ca6725055356579aeb7b0955bfaf56cc4a24a37d244a08476e81'
    },

    SLAAPKAMER: {
        fqdn: {
            airplay: 'Slaapkamer._airplay._tcp.local',
            companionLink: 'Slaapkamer._companion-link._tcp.local'
        },
        identifier: '4681BDFE-937D-48BF-97BF-E7F06D486238',
        longTermPublicKey: '8425791eb25637ed57e10173e9eeab12a74f8cc7fafac288f71d067c152ec540',
        pairingId: 'C4:38:75:ED:54:78',
        privateKey: '45e87db64d052e1b16b7303269b73b3d30bbbfd3a3dbcc10973888fe74e74b9f5077871e92fddc7f6b01c66127eae349477d060158e070f7d39ee9f7f7a4aa4d',
        publicKey: '5077871e92fddc7f6b01c66127eae349477d060158e070f7d39ee9f7f7a4aa4d'
    },

    WOONKAMER: {
        fqdn: {
            airplay: 'Woonkamer HomePod._airplay._tcp.local',
            companionLink: 'Woonkamer HomePod._companion-link._tcp.local'
        },
        identifier: '0AE43785-AB47-4365-B750-63E71F943143',
        longTermPublicKey: '27a7748dbada78ac28f2415955994a24e07761a00bbd0c81d68fcb973636026e',
        pairingId: '38:42:0B:EC:B3:67',
        privateKey: '97e4538a39839eaa38352e735d291beba64ee7ce474277a37a5c3d10c800a868df927401f2703a3b48b33be427ee59f647b71e84c4a6b0316391c87313356f6d',
        publicKey: 'df927401f2703a3b48b33be427ee59f647b71e84c4a6b0316391c87313356f6d'
    },

    WOONKAMER_TV: {
        fqdn: {
            airplay: 'Woonkamer TV._airplay._tcp.local',
            companionLink: 'Woonkamer TV._companion-link._tcp.local'
        },
        identifier: '7EEEA518-06CC-486C-A8B8-4A07CDBE6267',
        longTermPublicKey: 'cfb3fb0e0eb494d9058d5051c94400b35251e3faad66542b9551a1496570628d',
        pairingId: '7E:EE:A5:18:06:CC',
        privateKey: 'bfc77506dc91fd6803521eeac3673d643acd9ef0986664c2ef5248feef3f626ac529bdad82fb253132a353687d0d2a6c70f1438c0ee2e8fc9d55b0b801fadcf9',
        publicKey: 'c529bdad82fb253132a353687d0d2a6c70f1438c0ee2e8fc9d55b0b801fadcf9'
    }
} as const;

export const ACCESSORY = PAIRED_ACCESSORIES.WOONKAMER;
