import type { ValidationError } from '@basmilius/http-client';
import { resolveConstraint, translate } from '../config/state';

export default function (errors: Record<string, ValidationError>): Record<string, string> {
    const map: Record<string, string> = {};

    const convertAll = (errors: Record<string, ValidationError>, prefix?: string): void => {
        for (const key in errors) {
            const error = errors[key];
            const mapKey = prefix ? `${prefix}.${key}` : key;

            if (!error) {
                continue;
            }

            map[mapKey] = translate(resolveConstraint(error.error), error.params);

            if (error.errors) {
                convertAll(error.errors, mapKey);
            }
        }
    };

    convertAll(errors);

    return map;
}
