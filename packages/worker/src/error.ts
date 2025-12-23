export class MissingParameterError extends Error {
    constructor(param: string) {
        super(`Missing required parameter ${param}.`);
    }
}

export class InvalidValueError extends Error {
    constructor(param: string) {
        super(`Invalid value for parameter ${param}.`);
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}
