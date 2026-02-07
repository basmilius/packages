import { InvalidValueError, MissingParameterError, NotFoundError } from './error';
import { error } from './response';
import type { Routes, Worker } from './types';

export {
    InvalidValueError,
    MissingParameterError,
    NotFoundError
} from './error';

export {
    queryDate,
    queryInteger,
    queryPosition
} from './request';

export {
    error,
    json
} from './response';

export const createWorker = <TBindings = unknown>(routes: Routes<TBindings>): Worker<TBindings> => ({
    async fetch(req: Request, bindings: TBindings): Promise<Response> {
        const {pathname} = new URL(req.url);

        if (!routes[pathname]) {
            return error(404, 'not_found', 'The requested endpoint could not be found.', 404);
        }

        const route = routes[pathname];

        return route(req, bindings).catch(err => {
            if (err instanceof InvalidValueError) {
                return error(406, 'invalid_value', err.message, 406);
            }

            if (err instanceof MissingParameterError) {
                return error(400, 'missing_parameter', err.message, 400);
            }

            if (err instanceof NotFoundError) {
                return error(404, 'not_found', err.message, 404);
            }

            return error(500, 'internal_server_error', 'An unexpected error occurred.', 500);
        });
    }
});
