import { RequestError, ValidationError } from '../dto';
import RequestAbortedError from './RequestAbortedError';

export function isRequestAborted(obj: unknown): obj is RequestAbortedError {
    return obj instanceof RequestAbortedError;
}

export function isRequestError(obj: unknown): obj is RequestError {
    return obj instanceof RequestError;
}

export function isUnsanctionedRequest(statusCode: unknown): boolean {
    if (statusCode instanceof RequestError) {
        statusCode = statusCode.statusCode;
    }

    return statusCode === 403 || statusCode === 401;
}

export function isValidationError(obj: unknown): obj is ValidationError {
    return obj instanceof ValidationError;
}
