"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const customErrors_1 = require("../../framework/errors/customErrors");
const httpEnums_1 = require("./httpEnums");
const logger_1 = require("../../framework/services/logger");
class UserController {
    constructor(_userUseCase) {
        this._userUseCase = _userUseCase;
    }
    async register(req, res) {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password) {
                throw new customErrors_1.BadRequestError("All fields are required: username, email, and password");
            }
            const newUser = await this._userUseCase.registerUser({ email, password, username });
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(newUser);
        }
        catch (error) {
            if (error instanceof customErrors_1.BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new customErrors_1.InternalServerError("An unexpected error occurred").serializeError() });
        }
    }
    async verifyOTP(req, res) {
        try {
            const { email, otp } = req.body;
            const { user, accessToken, refreshToken } = await this._userUseCase.verifyOTP({ otp, email });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.status(httpEnums_1.HttpStatusCode.OK).json({ user, });
        }
        catch (error) {
            if (error instanceof customErrors_1.BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            logger_1.logger.error('OTP Verification Error:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'An unexpected error occurred' });
        }
    }
    async resendOTP(req, res) {
        logger_1.logger.info("resent otp  controller");
        try {
            const { email } = req.body;
            await this._userUseCase.resendOTP({ email });
            res.status(httpEnums_1.HttpStatusCode.OK).json({ message: "OTP resent successfully" });
        }
        catch (error) {
            if (error instanceof customErrors_1.InvalidTokenError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            logger_1.logger.error("Internal Server Error:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new customErrors_1.InternalServerError("An unexpected error occurred").serializeError() });
        }
    }
    async verifyToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ message: 'Refresh token is missing' });
                return;
            }
            const { accessToken } = await this._userUseCase.verifyToken(refreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });
            res.status(httpEnums_1.HttpStatusCode.OK).json({ accessToken });
        }
        catch (error) {
            res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ message: "Invalid refresh token" });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
            res.status(httpEnums_1.HttpStatusCode.OK).json({ message: "Logged out successfully" });
        }
        catch (error) {
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to log out" });
        }
    }
    async login(req, res) {
        try {
            console.log("");
            logger_1.logger.info("inside the login");
            const { email, password } = req.body;
            if (!email || !password) {
                res
                    .status(httpEnums_1.HttpStatusCode.BAD_REQUEST)
                    .json({ error: "All fields are required: email and password" });
                return;
            }
            const { user, accessToken, refreshToken } = await this._userUseCase.loginUser({ email, password });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(httpEnums_1.HttpStatusCode.OK).json({ user });
        }
        catch (error) {
            res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error });
        }
    }
    async profileImageUpload(req, res) {
        logger_1.logger.info("inside the profile image controller");
        try {
            const userId = req.user.userId;
            if (!userId) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const imageBuffer = req.file?.buffer;
            if (!imageBuffer) {
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: 'No image file provided' });
                return;
            }
            const secureUrl = await this._userUseCase.saveProfileImage(imageBuffer, userId);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ secureUrl });
        }
        catch (error) {
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to upload profile image' });
        }
    }
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const profileData = req.body;
            const result = await this._userUseCase.updateProfile(userId, profileData);
            res.status(httpEnums_1.HttpStatusCode.OK).json({
                message: 'Profile updated successfully',
                user: result.user
            });
        }
        catch (error) {
            logger_1.logger.error('Error updating profile:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                error: 'Failed to update profile',
            });
        }
    }
    async getProfile(req, res) {
        try {
            const userId = req.user.userId;
            if (!userId) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const users = await this._userUseCase.getProfile(userId);
            res.status(httpEnums_1.HttpStatusCode.OK).json(users);
        }
        catch (error) {
            logger_1.logger.error("Error listing users:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async friendprofile(req, res) {
        try {
            const { autherId } = req.params;
            if (!autherId) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const users = await this._userUseCase.getProfile(autherId);
            res.status(httpEnums_1.HttpStatusCode.OK).json(users);
        }
        catch (error) {
            logger_1.logger.error("Error listing users:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async getAllNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const notifications = await this._userUseCase.getAllNotifications(userId);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ notifications });
        }
        catch (error) {
            logger_1.logger.error("Error fetching notifications:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async sendNotifications(req, res) {
        try {
            const userId = req.user.userId;
            const { followerId } = req.body;
            const notification = await this._userUseCase.sendNotifications(followerId, userId);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ notification });
        }
        catch (error) {
            logger_1.logger.error("Error sending notifications:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async feedback(req, res) {
        try {
            const { name, email, message } = req.body;
            console.log(name, email, message);
            if (!name || !email || !message) {
                throw new customErrors_1.BadRequestError("All fields are required: name, email, and message");
            }
            const newUser = await this._userUseCase.sendFeedbackEmail(name, email, message);
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(newUser);
        }
        catch (error) {
            if (error instanceof customErrors_1.BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ errors: new customErrors_1.InternalServerError("An unexpected error occurred").serializeError() });
        }
    }
}
exports.UserController = UserController;
