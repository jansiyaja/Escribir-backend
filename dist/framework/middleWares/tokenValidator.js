"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdminToken = exports.authenticateToken = exports.authenticateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customErrors_1 = require("../errors/customErrors");
const jwtService_1 = require("../services/jwtService");
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const validateRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, refreshTokenSecret);
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }
};
const authenticateRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ error: 'Token is required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
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
const authenticateToken = async (req, res, next) => {
    try {
        const tokenFromCookie = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
        if (!tokenFromCookie) {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                console.error('Access and Refresh tokens are missing');
                res.status(401).json({ error: 'Access and Refresh tokens are required' });
                return;
            }
            try {
                const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const newAccessToken = (0, jwtService_1.generateAccessToken)(decodedRefreshToken.userId, decodedRefreshToken.role);
                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== "development",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 15 * 60 * 1000,
                });
                req.user = decodedRefreshToken;
                console.info('New access token generated from refresh token');
                return next();
            }
            catch (error) {
                console.error('Invalid refresh token', error);
                res.status(403).json({ error: 'Invalid refresh token' });
                return;
            }
        }
        const decoded = jsonwebtoken_1.default.verify(tokenFromCookie, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error('Access token invalid or expired');
            res.status(401).json({ error: 'Invalid or expired access token' });
            return;
        }
        console.error('Unexpected error in token authentication', error);
        res.status(500).json({ error: 'Unexpected server error' });
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
