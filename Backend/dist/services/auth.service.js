"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const app_error_1 = require("../utils/app-error");
const validation_1 = require("../utils/validation");
const registerUser = async (data) => {
    const { email, password } = data;
    // validation
    if (!email || !password) {
        throw new app_error_1.AppError("Email and password are required", 400);
    }
    if (!(0, validation_1.validateEmail)(email)) {
        throw new app_error_1.AppError("Invalid email format", 400);
    }
    if (!(0, validation_1.validatePassword)(password)) {
        throw new app_error_1.AppError("Password must be at least 6 characters", 400);
    }
    // check existing user
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new app_error_1.AppError("User already exists", 409);
    }
    // hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // create user
    const user = await prisma_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
    };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    // validation
    if (!email || !password) {
        throw new app_error_1.AppError("Email and password are required", 400);
    }
    if (!(0, validation_1.validateEmail)(email)) {
        throw new app_error_1.AppError("Invalid email format", 400);
    }
    // find user
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new app_error_1.AppError("Invalid credentials", 401);
    }
    // compare password
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new app_error_1.AppError("Invalid credentials", 401);
    }
    // generate access token
    const accessToken = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        jti: (0, crypto_1.randomUUID)(),
    }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    // generate refresh token
    const refreshToken = jsonwebtoken_1.default.sign({
        userId: user.id,
        jti: (0, crypto_1.randomUUID)(),
    }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
    // store refresh token in DB
    await prisma_1.default.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
        },
    });
    return {
        message: "Login successful",
        accessToken,
        refreshToken,
    };
};
exports.loginUser = loginUser;
const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new app_error_1.AppError("Refresh token required", 401);
    }
    // verify refresh token
    const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    // check token exists in DB
    const storedToken = await prisma_1.default.refreshToken.findUnique({
        where: {
            token: refreshToken,
        },
    });
    if (!storedToken) {
        throw new app_error_1.AppError("Invalid refresh token", 401);
    }
    // find user
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: decoded.userId,
        },
    });
    if (!user) {
        throw new app_error_1.AppError("User not found", 404);
    }
    // generate new access token
    const accessToken = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        jti: (0, crypto_1.randomUUID)(),
    }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });
    return {
        accessToken,
    };
};
exports.refreshAccessToken = refreshAccessToken;
const logoutUser = async (refreshToken) => {
    if (!refreshToken) {
        throw new app_error_1.AppError("Refresh token required", 400);
    }
    // check token exists
    const storedToken = await prisma_1.default.refreshToken.findUnique({
        where: {
            token: refreshToken,
        },
    });
    if (!storedToken) {
        throw new app_error_1.AppError("Invalid refresh token", 401);
    }
    // delete token
    await prisma_1.default.refreshToken.delete({
        where: {
            token: refreshToken,
        },
    });
    return {
        message: "Logout successful",
    };
};
exports.logoutUser = logoutUser;
const getAllUsers = async () => {
    return prisma_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            createdAt: true,
        },
    });
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            createdAt: true,
        },
    });
    if (!user) {
        throw new app_error_1.AppError("User not found", 404);
    }
    return user;
};
exports.getUserById = getUserById;
