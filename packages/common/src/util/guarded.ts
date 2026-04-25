import { isRequestError, isUnsanctionedRequest } from '@basmilius/http-client';
import { ForbiddenException, HandledException, UnauthorizedException } from '../error';

const ORIGINAL = Symbol();

export default function <T extends Function>(fn: T): T;
export default function <T extends Function>(fn: T, onError: (err: Error) => void): T;

/**
 * Adds basic global error checking on the provided function. Should
 * be used when fetching remote data. Don't use try-catch with this
 * function, because it throws exceptions that our global error handler
 * will catch for you.
 *
 * ```typescript
 * const {getOrder} = useService(OrderService);
 * const _getOrder = guarded(getOrder);
 * const _getOrder = guarded(getOrder, err => console.error(err));
 * const _getOrder = guarded(getOrder, 'Error snackbar title', 'Error snackbar message');
 * ```
 */
export default function <T extends Function>(fn: T, onError?: (err: Error) => void): T {
    if (isGuarded(fn)) {
        // note(Bas): Always wrap the original function, so we don't get
        //  double error handling.
        fn = fn[ORIGINAL];
    }

    const wrapped = async (...args: any[]): Promise<T> => {
        try {
            return await fn(...args);
        } catch (err) {
            if (isRequestError(err) && err.statusCode === 403) {
                throw new ForbiddenException();
            }

            if (isUnsanctionedRequest(err)) {
                throw new UnauthorizedException();
            }

            if (onError && typeof onError === 'function') {
                onError(err as Error);

                throw new HandledException();
            }

            throw err;
        }
    };

    wrapped[ORIGINAL] = fn;

    return wrapped as unknown as T;
}

function isGuarded<T extends Function>(fn: T | Guarded<T>): fn is Guarded<T> {
    return ORIGINAL in fn;
}

type Guarded<T extends Function> = Function & {
    readonly [ORIGINAL]: T;
};
