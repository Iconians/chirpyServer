export class HttpError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class BadRequestError extends HttpError {
    constructor(message) {
        super(message, 400);
    }
}
export class UnauthorizedError extends HttpError {
    constructor(message) {
        super(message, 401);
    }
}
export class ForbiddenError extends HttpError {
    constructor(message) {
        super(message, 403);
    }
}
export class notFoundError extends HttpError {
    constructor(message) {
        super(message, 404);
    }
}
