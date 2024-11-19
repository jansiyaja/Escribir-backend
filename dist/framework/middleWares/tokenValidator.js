"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdminToken = exports.authenticateToken = exports.authenticateRefreshToken = exports.refreshTokenSecret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customErrors_1 = require("../errors/customErrors");
exports.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ error: 'Token is required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, exports.refreshTokenSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({ error: 'Invalid refresh token' });
            return;
        }
        next(new customErrors_1.InvalidTokenError('An unexpected error occurred'));
    }
};
exports.authenticateRefreshToken = authenticateRefreshToken;
const authenticateToken = (req, res, next) => {
    const tokenFromCookie = req.cookies.accessToken;
    const token = tokenFromCookie;
    if (!token) {
        res.status(401).json({ error: 'Token is required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        next(new customErrors_1.InvalidTokenError('An unexpected error occurred'));
    }
};
exports.authenticateToken = authenticateToken;
const authenticateAdminToken = (req, res, next) => {
    const tokenFromCookie = req.cookies.accessToken;
    const token = tokenFromCookie;
    if (!token) {
        res.status(401).json({ error: 'Token is required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.role !== 'admin') {
            res.status(403).json({ error: 'Admin access required' });
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(403).json({ error: 'Invalid token' });
            return;
        }
        next(new customErrors_1.InvalidTokenError('An unexpected error occurred'));
    }
};
exports.authenticateAdminToken = authenticateAdminToken;
