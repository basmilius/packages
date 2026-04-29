import type { DefaultTheme } from 'vitepress';

export const httpClient: DefaultTheme.SidebarItem[] = [
    {
        text: 'HTTP Client',
        items: [
            {text: 'Introduction', link: '/http-client/'},
            {text: 'Installation', link: '/http-client/installation'}
        ]
    },
    {
        text: 'Guides',
        collapsed: false,
        items: [
            {text: 'Quick start', link: '/http-client/guide/quickstart'},
            {text: 'DTO pattern', link: '/http-client/guide/dto-pattern'},
            {text: 'Error handling', link: '/http-client/guide/error-handling'}
        ]
    },
    {
        text: 'Adapter',
        collapsed: false,
        items: [
            {text: 'HttpAdapter', link: '/http-client/adapter/HttpAdapter'}
        ]
    },
    {
        text: 'Decorators',
        collapsed: false,
        items: [
            {text: '@adapter', link: '/http-client/decorator/adapter'},
            {text: '@bound', link: '/http-client/decorator/bound'},
            {text: '@debounce', link: '/http-client/decorator/debounce'},
            {text: '@dto', link: '/http-client/decorator/dto'}
        ]
    },
    {
        text: 'DTOs',
        collapsed: false,
        items: [
            {text: 'BlobResponse', link: '/http-client/dto/BlobResponse'},
            {text: 'Paginated', link: '/http-client/dto/Paginated'},
            {text: 'RequestError', link: '/http-client/dto/RequestError'},
            {text: 'ValidationError', link: '/http-client/dto/ValidationError'}
        ]
    },
    {
        text: 'HTTP',
        collapsed: false,
        items: [
            {text: 'BaseResponse', link: '/http-client/http/BaseResponse'},
            {text: 'BaseService', link: '/http-client/http/BaseService'},
            {text: 'HttpClient', link: '/http-client/http/HttpClient'},
            {text: 'QueryString', link: '/http-client/http/QueryString'},
            {text: 'RequestBuilder', link: '/http-client/http/RequestBuilder'},
            {text: 'Helpers', link: '/http-client/http/helpers'}
        ]
    }
];
