import { HTTP_STATUS } from "../../../constants/httpConstants";

export class AppError extends Error {
    statusCode: number;
    
    constructor(message: string, statusCode: number){
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Validate Error 400
export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}

// Validate Error 404
export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, HTTP_STATUS.NOT_FOUND);
    }
}