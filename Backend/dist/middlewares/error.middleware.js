"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const app_error_1 = require("../utils/app-error");
const errorMiddleware = (error, req, res, next) => {
    console.error(error);
    if ((0, app_error_1.isAppError)(error)) {
        const status = error.statusCode || 500;
        return res.status(status).json({
            status: status >= 500 ? "error" : "fail",
            message: error.message,
        });
    }
    return res.status(500).json({
        status: "error",
        message: error?.message || "Internal server error",
    });
};
exports.errorMiddleware = errorMiddleware;
