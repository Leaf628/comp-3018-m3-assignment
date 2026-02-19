import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const error = err as any;
    
    // Check if statusCode exists
    if(error.statusCode) {
        res.status(error.statusCode).json({
            status: "error",
            error: err.name,
            message: err.message
        });
        return
    }
      
    // Unknown error
    console.error("Unexpected error:", err);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: "error",
        error: "InternalServerError",
        message: err.message || "An unexpected error occurred"
    });
};
