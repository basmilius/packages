import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import 'virtual:group-icons.css';
import './custom.css';
import ApiSignature from './components/ApiSignature.vue';
import Emits from './components/Emits.vue';
import FrontmatterDocs from './components/FrontmatterDocs.vue';
import PackageBadge from './components/PackageBadge.vue';
import Props from './components/Props.vue';
import Slots from './components/Slots.vue';

export default {
    extends: DefaultTheme,
    enhanceApp({app}) {
        app.component('ApiSignature', ApiSignature);
        app.component('Emits', Emits);
        app.component('FrontmatterDocs', FrontmatterDocs);
        app.component('PackageBadge', PackageBadge);
        app.component('Props', Props);
        app.component('Slots', Slots);
    }
} satisfies Theme;
