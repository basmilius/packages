import { DateTime } from 'luxon';
import { InvalidValueError, MissingParameterError } from './error';
import type { Coords } from './types';

export function queryDate(req: Request, name: string = 'date'): DateTime {
    const {searchParams} = new URL(req.url);

    if (!searchParams.has(name)) {
        throw new MissingParameterError(name);
    }

    const date = DateTime.fromFormat(searchParams.get(name)!, 'yyyy-MM-dd');

    if (!date.isValid) {
        throw new InvalidValueError(name);
    }

    return date;
}

export function queryInteger(req: Request, name: string): number {
    const {searchParams} = new URL(req.url);

    if (!searchParams.has(name)) {
        throw new MissingParameterError(name);
    }

    const raw = searchParams.get(name)!;
    const value = Number(raw);

    if (!Number.isInteger(value) || isNaN(value)) {
        throw new InvalidValueError(name);
    }

    return value;
}

export function queryPosition(req: Request): Coords {
    const {searchParams} = new URL(req.url);

    if (!searchParams.has('latitude') || !searchParams.has('longitude')) {
        throw new MissingParameterError('latitude or longitude');
    }

    const latitude = parseFloat(searchParams.get('latitude')!);
    const longitude = parseFloat(searchParams.get('longitude')!);

    if (isNaN(latitude) || isNaN(longitude)) {
        throw new InvalidValueError('latitude or longitude');
    }

    if (latitude < -90 || latitude > 90) {
        throw new InvalidValueError('latitude');
    }

    if (longitude < -180 || longitude > 180) {
        throw new InvalidValueError('longitude');
    }

    return {
        latitude,
        longitude
    };
}
