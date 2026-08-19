"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = require("../utils/app-error");
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(new app_error_1.AppError("No token provided", 401));
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return next(new app_error_1.AppError("Invalid token format", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new app_error_1.AppError("Unauthorized", 401));
    }
};
exports.authMiddleware = authMiddleware;
