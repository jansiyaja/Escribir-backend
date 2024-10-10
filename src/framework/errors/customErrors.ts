

import { CustomError } from "./customError";



export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeError() {
        return [{ message: this.message }];
    }
}
 
export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeError() {
        return [{ message: this.message }];
    }
}

export class  InternalServerError extends CustomError{
    statusCode = 500;

    constructor(public message:string){
        super(message);
        Object.setPrototypeOf(this,InternalServerError.prototype);
    }
    serializeError() {
        return [{ message: this.message }];
    }
    
}

export class UnauthorizedError extends CustomError {
    statusCode = 401;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    serializeError() {
        return [{ message: this.message }];
    }
}

export class InvalidTokenError extends CustomError {
    statusCode = 403;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }

    serializeError() {
        return [{ message: this.message }];
    }
}
