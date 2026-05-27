import { DateTime } from 'luxon';
import { adapter } from '../decorator';
import { Paginated, RequestError, ValidationError } from '../dto';
import type { ForeignData, HttpStatusCode } from '../type';

@adapter
export class HttpAdapter {
    public static parsePaginatedAdapter<T>(data: ForeignData, adapterMethod: (item: object) => T): Paginated<T> {
        return new Paginated<T>(
            data.items.map(adapterMethod),
            data.page,
            data.page_size,
            data.pages,
            data.total
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

        return matches[1]
            .replaceAll('\'', '')
            .replaceAll('\"', '')
            .replaceAll('\/', '-')
            .replaceAll('\:', '-');
    }

    public static parseRequestError(data: ForeignData, statusCode: HttpStatusCode): RequestError {
        return new RequestError(
            data.code,
            data.error,
            data.error_description,
            statusCode
        );
    }

    public static parseValidationError(data: ForeignData): ValidationError {
        let errors: Record<string, ValidationError>;

        if (data.errors) {
            errors = {};

            Object.entries(data.errors).forEach(([key, value]) => {
                errors[key] = HttpAdapter.parseValidationError(value as object);
            });
        }

        return new ValidationError(
            data.code,
            data.error,
            data.error_description,
            errors,
            data.params
        );
    }
}
