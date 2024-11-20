"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const cloudinaryConfig_1 = require("../framework/config/cloudinaryConfig");
const customErrors_1 = require("../framework/errors/customErrors");
const jwtService_1 = require("../framework/services/jwtService");
const logger_1 = require("../framework/services/logger");
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserUseCase {
    constructor(_userRepository, _hashService, _emailServices, _otpRepository, _notificationRepo) {
        this._userRepository = _userRepository;
        this._hashService = _hashService;
        this._emailServices = _emailServices;
        this._otpRepository = _otpRepository;
        this._notificationRepo = _notificationRepo;
    }
    async registerUser(userData) {
        logger_1.logger.info("checking existing user");
        const existingUser = await this._userRepository.findByEmail(userData.email);
        if (existingUser) {
            throw new customErrors_1.BadRequestError("User with email already exists");
        }
        const hashedPassword = await this._hashService.hash(userData.password);
        const otp = crypto_1.default.randomInt(1000, 9999).toString();
        console.log(otp);
        const newUser = {
            ...userData,
            password: hashedPassword,
            isVerified: false,
        };
        const createUser = await this._userRepository.create(newUser);
        if (!createUser.email) {
            throw new Error("Failed to create user: Email is null");
        }
        const newOtp = { otp: otp, email: createUser.email };
        await this._otpRepository.create(newOtp);
        if (!process.env.MAIL_EMAIL) {
            throw new customErrors_1.BadRequestError("admin email is not getting");
        }
        await this._emailServices.sendEmail({
            from: process.env.MAIL_EMAIL,
            to: userData.email,
            subject: "Welcome To Escriber, Our Blog Platform!",
            text: `Hi ${userData.username}, welcome to our platform! We're excited to have you here.Your Otp Is ${otp}`,
        });
        return {
            user: createUser,
        };
    }
    async verifyOTP({ otp, email, }) {
        logger_1.logger.info("Verifying OTP for email", { email });
        const otpVerification = await this._otpRepository.findByUserByEmail(email);
        if (!otpVerification) {
            throw new customErrors_1.BadRequestError("No OTP record found for this email");
        }
        const otpCreatedAt = otpVerification.createdAt;
        if (!otpCreatedAt) {
            throw new customErrors_1.InternalServerError("OTP creation time is missing");
        }
        const currentTime = new Date();
        const hourDifference = (currentTime.getTime() - otpCreatedAt.getTime()) / (1000 * 60 * 60);
        if (hourDifference > 1) {
            await this._userRepository.delete(email);
            throw new customErrors_1.BadRequestError("OTP expired and user deleted");
        }
        if (otpVerification.otp !== otp) {
            throw new customErrors_1.BadRequestError("Invalid OTP provided");
        }
        await this._userRepository.markAsVerified(email);
        await this._otpRepository.deleteByUserId(email);
        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new customErrors_1.InternalServerError("User not found");
        }
        const userRole = user.role;
        const accessToken = (0, jwtService_1.generateAccessToken)(user._id, userRole);
        const refreshToken = (0, jwtService_1.generateRefreshToken)(user._id, userRole);
        return { user, accessToken, refreshToken };
    }
    async resendOTP({ email }) {
        const otp = crypto_1.default.randomInt(1000, 9999).toString();
        console.log("new OTP", otp);
        console.log("new Email", email);
        await this._otpRepository.updateOtp(email, otp);
        const userData = await this._userRepository.findByEmail(email);
        console.log(userData, "user");
        if (!userData) {
            throw new customErrors_1.InvalidTokenError("There is no user  with this email");
        }
        if (!process.env.MAIL_EMAIL) {
            throw new customErrors_1.BadRequestError("admin email is not getting");
        }
        await this._emailServices.sendEmail({
            from: process.env.MAIL_EMAIL,
            to: userData.email,
            subject: "Welcome To Escriber, Our Blog Platform!",
            text: `Hi ${userData.username}, welcome to our platform! We're excited to have you here.Your Otp Is ${otp}`,
        });
    }
    async verifyToken(token) {
        try {
            logger_1.logger.info("Starting token verification");
            const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const user = await this._userRepository.findById(decoded.userId);
            if (!user || !user._id) {
                logger_1.logger.error("User not found or user ID is missing");
                throw new Error("User not found or user ID is missing");
            }
            const userRole = user.role;
            const accessToken = (0, jwtService_1.generateAccessToken)(user._id, userRole);
            logger_1.logger.info("Token verification successful, returning new tokens");
            return {
                accessToken,
            };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                logger_1.logger.error("Token has expired");
                throw new Error("Refresh token has expired");
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                logger_1.logger.error("Invalid token");
                throw new Error("Invalid refresh token");
            }
            else {
                logger_1.logger.error("Error verifying token:", error);
                throw new Error("Token verification failed");
            }
        }
    }
    async loginUser(userData) {
        const existingUser = await this._userRepository.findByEmail(userData.email);
        if (!existingUser) {
            throw new Error("User with email does not exist");
        }
        if (existingUser.isBlock) {
            throw new Error("User is blocked by admin");
        }
        const isMatch = await this._hashService.compare(userData.password, existingUser.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const userRole = existingUser.role;
        const userId = existingUser._id;
        if (!userId) {
            throw new Error("User ID is missing");
        }
        const accessToken = (0, jwtService_1.generateAccessToken)(userId, userRole);
        const refreshToken = (0, jwtService_1.generateRefreshToken)(userId, userRole);
        return {
            user: existingUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }
    async saveProfileImage(imageBuffer, userId) {
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) {
                throw new customErrors_1.NotFoundError("User not found");
            }
            let existingImageUrl = user.image;
            console.log("existing ", existingImageUrl);
            let existingImageId = null;
            if (existingImageUrl) {
                const existingImageParts = existingImageUrl.split("/");
                existingImageId =
                    existingImageParts[existingImageParts.length - 1].split(".")[0];
            }
            if (existingImageId) {
                try {
                    await cloudinaryConfig_1.cloudinary.uploader.destroy(existingImageId);
                }
                catch (error) {
                    logger_1.logger.error("Error deleting existing image from Cloudinary:", error);
                }
            }
            if (!(imageBuffer instanceof Buffer)) {
                throw new Error("Invalid image buffer");
            }
            const newImageUrl = await new Promise((resolve, reject) => {
                const uploadStream = cloudinaryConfig_1.cloudinary.uploader.upload_stream({ resource_type: "image", folder: "Escribir_Profile_Images" }, (error, result) => {
                    if (error) {
                        logger_1.logger.error("Cloudinary upload error:", error);
                        return reject(new Error("Cloudinary upload failed"));
                    }
                    if (result && result.secure_url) {
                        resolve(result.secure_url);
                    }
                    else {
                        reject(new Error("Failed to get secure URL from Cloudinary response"));
                    }
                });
                uploadStream.end(imageBuffer);
            });
            try {
                await this._userRepository.updateUserDetails(userId, {
                    image: newImageUrl,
                });
            }
            catch (dbError) {
                logger_1.logger.error("Database update error:", dbError);
                throw new Error("Failed to update user image in database");
            }
            return newImageUrl;
        }
        catch (error) {
            logger_1.logger.info("Error in uploading profile image", error);
            throw new Error("Failed to upload profile image");
        }
    }
    async updateProfile(userId, profileData) {
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const updatedUserData = {
                ...user,
                ...profileData,
            };
            await this._userRepository.updateUserDetails(userId, updatedUserData);
            const updatedUser = await this._userRepository.findById(userId);
            if (!updatedUser) {
                throw new Error("User is not updated");
            }
            return { user: updatedUser };
        }
        catch (error) {
            logger_1.logger.error("Error updating user profile", error);
            throw new Error("Failed to update user profile");
        }
    }
    async getProfile(userId) {
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            return { user };
        }
        catch (error) {
            logger_1.logger.error("Error fetching user profile:", error);
            throw new Error("Failed to fetch user profile");
        }
    }
    async sendFeedbackEmail(name, email, message) {
        if (!process.env.MAIL_EMAIL) {
            throw new customErrors_1.BadRequestError("admin email is not getting");
        }
        await this._emailServices.sendEmail({
            from: email,
            to: process.env.MAIL_EMAIL,
            subject: "Feed back From User",
            text: `Hi, iam ${name},  ${message}`,
        });
        return "sending email successfully";
    }
    //-------------------------------------------------------------------------------------------------------------------------------------------//
    async getAllNotifications(userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new customErrors_1.NotFoundError("User not found");
        }
        const notifications = await this._notificationRepo.getNotifications(userId);
        return notifications;
    }
    async sendNotifications(followerId, userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new customErrors_1.NotFoundError("User not found");
        }
        const follower = await this._userRepository.findById(followerId);
        if (!follower) {
            throw new customErrors_1.NotFoundError("Follower not found");
        }
        const notificationForSender = await this._notificationRepo.sendNotification(followerId, userId, `You are now following ${user.username}`);
        const notificationForReceiver = await this._notificationRepo.sendNotification(userId, followerId, `${follower.username} is now following you`);
        return;
    }
}
exports.UserUseCase = UserUseCase;
