import type { DefaultTheme } from 'vitepress';

export const validation: DefaultTheme.SidebarItem[] = [
    {
        text: 'Validation',
        items: [
            {text: 'Introduction', link: '/validation/'},
            {text: 'Installation', link: '/validation/installation'},
            {text: 'Message keys', link: '/validation/message-keys'},
            {text: 'Server errors', link: '/validation/server-errors'}
        ]
    },
    {
        text: 'Composables',
        collapsed: false,
        items: [
            {text: 'useValidation', link: '/validation/composable/useValidation'}
        ]
    },
    {
        text: 'Configuration',
        collapsed: false,
        items: [
            {text: 'createValidation', link: '/validation/config/createValidation'},
            {text: 'configureValidation', link: '/validation/config/configureValidation'}
        ]
    },
    {
        text: 'Components',
        collapsed: false,
        items: [
            {text: 'ValidationField', link: '/validation/component/ValidationField'},
            {text: 'ValidationNotice', link: '/validation/component/ValidationNotice'},
            {text: 'ValidationSection', link: '/validation/component/ValidationSection'}
        ]
    },
    {
        text: 'Rules',
        collapsed: false,
        items: [
            {text: 'Built-in rules', link: '/validation/rule/'},
            {text: 'afterDate', link: '/validation/rule/afterDate'},
            {text: 'beforeDate', link: '/validation/rule/beforeDate'},
            {text: 'betweenDates', link: '/validation/rule/betweenDates'},
            {text: 'bsn', link: '/validation/rule/bsn'},
            {text: 'postalCode', link: '/validation/rule/postalCode'},
            {text: 'named & toNamedRules', link: '/validation/rule/named'}
        ]
    }
];
