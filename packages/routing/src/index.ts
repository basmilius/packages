// note: Side-effect import — registers the `declare module 'vue-router'`
//  augmentations (`RouteLocationOptions.modal`, `RouteMeta.modal`).
import './augmentations';

export * from 'vue-router';

// note: Named exports below shadow the star re-export — ES modules
//  resolve direct exports over star re-exports. Our enhanced versions
//  win for `createRouter`, `RouterView`, etc.; every other vue-router
//  symbol flows through unchanged.
export { default as createRouter } from './createRouter';
export type { ModalConfig, ModalWrapperProps, RouterOptions, RouterViewProps } from './types';

export { default as ModalRouterView } from './component/ModalRouterView';
export { default as RouterLink } from './component/RouterLink';
export { default as RouterView } from './component/RouterView';

export { default as useIsView } from './composable/useIsView';
export { default as useModalRoute } from './composable/useModalRoute';
export { default as useNamedRoute } from './composable/useNamedRoute';
export { default as useNavigate } from './composable/useNavigate';
export { default as useRoute, type UseRoute } from './composable/useRoute';
export { default as useRouteMeta } from './composable/useRouteMeta';
export { default as useRouteNames } from './composable/useRouteNames';
export { default as useRouteParam } from './composable/useRouteParam';
export { default as useRouteView } from './composable/useRouteView';
