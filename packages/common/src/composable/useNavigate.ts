import { type NavigationFailure, type RouteLocationRaw, useRouter } from 'vue-router';

type To = Omit<RouteLocationRaw, 'replace'>;
type Navigate = (to: To, replace?: boolean) => Promise<NavigationFailure | void | undefined>;
type Wrap = (fn: Navigate) => Navigate;

export default function (...wrap: Wrap[]) {
    const router = useRouter();

    let navigate = async (to: To, replace: boolean = false) => {
        if (replace) {
            return await router.replace(to);
        }

        return await router.push(to);
    };

    for (let wrapper of wrap) {
        navigate = wrapper(navigate);
    }

    return {
        navigate,

        push: (to: To) => navigate(to),
        replace: (to: To) => navigate(to, true)
    };
}
