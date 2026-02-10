import { DateTime } from 'luxon';
import { adapter } from '../decorator';
import { Paginated, RequestError, ValidationError } from '../dto';
import type { HttpStatusCode } from '../type';

@adapter
export class HttpAdapter {
    public static parsePaginatedAdapter<T>(response: object, adapterMethod: (item: object) => T): Paginated<T> {
        // Type guard checks
        if (!('items' in response) || !Array.isArray(response.items)) {
            throw new Error('Invalid paginated response: missing or invalid items array');
        }
        if (!('page' in response) || typeof response.page !== 'number') {
            throw new Error('Invalid paginated response: missing or invalid page number');
        }
        if (!('page_size' in response) || typeof response.page_size !== 'number') {
            throw new Error('Invalid paginated response: missing or invalid page_size');
        }
        if (!('pages' in response) || typeof response.pages !== 'number') {
            throw new Error('Invalid paginated response: missing or invalid pages count');
        }
        if (!('total' in response) || typeof response.total !== 'number') {
            throw new Error('Invalid paginated response: missing or invalid total count');
        }

        return new Paginated<T>(
            response.items.map(adapterMethod),
            response.page,
            response.page_size,
            response.pages,
            response.total
        );
    }

    public static parseFileNameFromContentDispositionHeader(header: string): string {
        const defaultFilename = `download-${DateTime.now().toFormat('yyyy-MM-dd HH-mm-ss')}`;

        if (!header.startsWith('attachment')) {
            return defaultFilename;
        }

        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(header);

        if ((matches?.length || 0) < 2) {
            return defaultFilename;
        }

        // TypeScript strict mode: matches is guaranteed to be non-null here
        return matches![1]
            .replaceAll('\'', '')
            .replaceAll('\"', '')
            .replaceAll('\/', '-')
            .replaceAll('\:', '-');
    }

    public static parseRequestError(response: object, statusCode: HttpStatusCode): RequestError {
        // Type guard checks
        if (!('code' in response) || typeof response.code !== 'number') {
            throw new Error('Invalid error response: missing or invalid code');
        }
        if (!('error' in response) || typeof response.error !== 'string') {
            throw new Error('Invalid error response: missing or invalid error');
        }
        if (!('error_description' in response) || typeof response.error_description !== 'string') {
            throw new Error('Invalid error response: missing or invalid error_description');
        }

        return new RequestError(
            response.code,
            response.error,
            response.error_description,
            statusCode
        );
    }

    public static parseValidationError(response: object): ValidationError {
        // Type guard checks
        if (!('code' in response) || typeof response.code !== 'number') {
            throw new Error('Invalid validation error response: missing or invalid code');
        }
        if (!('error' in response) || typeof response.error !== 'string') {
            throw new Error('Invalid validation error response: missing or invalid error');
        }
        if (!('error_description' in response) || typeof response.error_description !== 'string') {
            throw new Error('Invalid validation error response: missing or invalid error_description');
        }

        let errors: Record<string, ValidationError> | undefined;

        if ('errors' in response && response.errors) {
            errors = {};

            Object.entries(response.errors).forEach(([key, value]) => {
                errors![key] = HttpAdapter.parseValidationError(value as object);
            });
        }

        let params: Record<string, string | number | boolean> | undefined;
        if ('params' in response && response.params && typeof response.params === 'object') {
            params = response.params as Record<string, string | number | boolean>;
        }

        return new ValidationError(
            response.code,
            response.error,
            response.error_description,
            errors,
            params
        );
    }
}
