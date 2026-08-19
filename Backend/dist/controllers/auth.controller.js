"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getAllUsers = exports.getMe = exports.logout = exports.refreshToken = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/auth.service"));
const register = async (req, res, next) => {
    console.log(req.body);
    try {
        const user = await authService.registerUser(req.body);
        return res.status(201).json({
            message: "User created",
            user,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const result = await authService.loginUser(req.body);
        return res.status(200).json(result);
    }
    catch (error) {
        return next(error);
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshAccessToken(req.body.refreshToken);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res, next) => {
    try {
        const result = await authService.logoutUser(req.body.refreshToken);
        return res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
const getMe = async (req, res, next) => {
    try {
        return res.status(200).json({
            user: req.user,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getMe = getMe;
const getAllUsers = async (_req, res, next) => {
    try {
        const users = await authService.getAllUsers();
        return res.status(200).json({
            users,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    try {
        const user = await authService.getUserById(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        return res.status(200).json({
            user,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getUserById = getUserById;
