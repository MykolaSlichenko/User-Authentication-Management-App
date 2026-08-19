"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.AppError = AppError;
const isAppError = (err) => {
    return err instanceof AppError || (err && typeof err.statusCode === 'number');
};
exports.isAppError = isAppError;
