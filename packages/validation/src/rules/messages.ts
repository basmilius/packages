export default function (type: string, params: readonly unknown[]): Record<string, unknown> {
    switch (type) {
        case 'between':
            return {min: params[0], max: params[1]};

        case 'maxLength':
        case 'maxValue':
            return {max: params[0]};

        case 'minLength':
        case 'minValue':
            return {min: params[0]};

        case 'sameAs':
            return {otherName: params[1] ?? 'other'};

        default:
            return {};
    }
}
