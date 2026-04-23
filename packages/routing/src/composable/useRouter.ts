import { type Router, useRouter as useVueRouter } from 'vue-router';

// note: Re-exported so consumers can import `useRouter` from
//  `@basmilius/routing` — matching how they also import `useRoute`,
//  `RouterView`, `RouterLink`, etc. from the wrapper. Behaviourally
//  identical to vue-router's `useRouter` since `push` / `replace` are
//  patched on the router instance itself during `createRouter()`.
export default function (): Router {
    return useVueRouter();
}
