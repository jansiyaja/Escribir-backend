"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenError = exports.UnauthorizedError = exports.InternalServerError = exports.NotFoundError = exports.BadRequestError = void 0;
const customError_1 = require("./customError");
class BadRequestError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 400;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 404;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 500;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.InternalServerError = InternalServerError;
class UnauthorizedError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 401;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.UnauthorizedError = UnauthorizedError;
class InvalidTokenError extends customError_1.CustomError {
    constructor(message) {
        super(message);
        this.message = message;
        this.statusCode = 403;
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
}
exports.InvalidTokenError = InvalidTokenError;
