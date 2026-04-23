// note: Side-effect import — registers `declare module 'vue-router'`
//  augmentations (`RouteLocationOptions.modal`, `RouteMeta.modal`) so
//  consumers automatically get the extended types.
import './augmentations';

export * from 'vue-router';

// note: The named exports below shadow the star re-export above because
//  ES modules resolve direct exports over star re-exports. That's how
//  `createRouter`, `RouterView`, `RouterLink`, `useRoute`, `useRouter`
//  and `RouterOptions` become our enhanced versions while every other
//  vue-router symbol (e.g. `createWebHistory`, `RouteLocationRaw`) flows
//  through unchanged. Migration is a simple import-path swap.
export { default as createRouter } from './createRouter';
export type { ModalConfig, RouterOptions } from './types';

export { default as RouterLink } from './component/RouterLink';
export { default as RouterView } from './component/RouterView';

export { default as useIsView } from './composable/useIsView';
export { default as useNamedRoute } from './composable/useNamedRoute';
export { default as useNavigate } from './composable/useNavigate';
export { default as useRoute, type UseRoute } from './composable/useRoute';
export { default as useRouteMeta } from './composable/useRouteMeta';
export { default as useRouteNames } from './composable/useRouteNames';
export { default as useRouteParam } from './composable/useRouteParam';
export { default as useRouteView } from './composable/useRouteView';
export { default as useRouter } from './composable/useRouter';
