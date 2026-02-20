import { DateTime } from 'luxon';
import { adapter } from '../decorator';
import { Paginated, RequestError, ValidationError } from '../dto';
import type { HttpStatusCode } from '../type';

@adapter
export class HttpAdapter {
    /**
     * Parses a paginated response from the backend.
     * Validates the response structure and applies the adapter method to each item.
     * 
     * @param response - The paginated response object containing items, page info, etc.
     * @param adapterMethod - Function to transform each item in the items array.
     * @returns A Paginated instance with transformed items.
     * @throws {Error} If the response structure is invalid or missing required fields.
     * 
     * @example
     * ```typescript
     * const paginated = HttpAdapter.parsePaginatedAdapter(response, User.fromJson);
     * console.log(paginated.items, paginated.total);
     * ```
     */
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

    /**
     * Parses a filename from a Content-Disposition header.
     * Sanitizes the filename to prevent path traversal and other security issues.
     * 
     * @param header - The Content-Disposition header value.
     * @returns A sanitized filename or a default timestamp-based filename.
     * 
     * @example
     * ```typescript
     * const filename = HttpAdapter.parseFileNameFromContentDispositionHeader(
     *   'attachment; filename="document.pdf"'
     * );
     * ```
     */
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
        // Sanitize filename: remove quotes, replace path separators and colons
        let filename = matches![1]
            .replaceAll('\'', '')
            .replaceAll('\"', '')
            .replaceAll('/', '-')        // Forward slash
            .replaceAll('\\\\', '-')     // Backslash (properly escaped)
            .replaceAll(':', '-')        // Colon (no need to escape)
            .trim();

        // Recursively remove all '..' patterns to prevent directory traversal
        while (filename.includes('..')) {
            filename = filename.replaceAll('..', '-');
        }

        // Additional security: ensure filename is not empty after sanitization
        return filename.length > 0 ? filename : defaultFilename;
    }

    /**
     * Parses a standard error response from the backend.
     * Validates the response structure and creates a RequestError instance.
     * 
     * @param response - The error response object containing code, error, and error_description.
     * @param statusCode - The HTTP status code of the response.
     * @returns A RequestError instance.
     * @throws {Error} If the response structure is invalid or missing required fields.
     * 
     * @example
     * ```typescript
     * const error = HttpAdapter.parseRequestError(errorData, 400);
     * throw error;
     * ```
     */
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

    /**
     * Parses a validation error response from the backend.
     * Recursively parses nested validation errors for complex forms.
     * 
     * @param response - The validation error response object.
     * @returns A ValidationError instance with nested error details.
     * @throws {Error} If the response structure is invalid or missing required fields.
     * 
     * @example
     * ```typescript
     * const validationError = HttpAdapter.parseValidationError(errorData);
     * console.log(validationError.errors); // Nested field errors
     * ```
     */
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

        let errors: Record<string, ValidationError> = {};

        if ('errors' in response && response.errors) {
            Object.entries(response.errors).forEach(([key, value]) => {
                errors[key] = HttpAdapter.parseValidationError(value as object);
            });
        }

        let params: Record<string, string | number | boolean> = {};
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
