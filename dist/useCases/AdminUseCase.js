"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUseCase = void 0;
const logger_1 = require("../framework/services/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customErrors_1 = require("../framework/errors/customErrors");
const jwtService_1 = require("../framework/services/jwtService");
class AdminUseCase {
    constructor(_adminRepository, _hashService, _userRepository) {
        this._adminRepository = _adminRepository;
        this._hashService = _hashService;
        this._userRepository = _userRepository;
    }
    async loginAdmin(adminData) {
        if (!adminData.email) {
            throw new Error("Email is required");
        }
        if (!adminData.password) {
            throw new Error("Password is required");
        }
        const existingAdmin = await this._adminRepository.findByEmail(adminData.email);
        if (!existingAdmin) {
            throw new Error("No admin found with this email.");
        }
        const isMatch = await this._hashService.compare(adminData.password, existingAdmin.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const adminRole = existingAdmin.role;
        console.log(adminRole);
        const accessToken = (0, jwtService_1.generateAccessToken)(existingAdmin._id.toString(), adminRole);
        const refreshToken = (0, jwtService_1.generateRefreshToken)(existingAdmin._id.toString(), adminRole);
        return { user: existingAdmin, accessToken: accessToken, refreshToken: refreshToken };
    }
    async verifyToken(token) {
        try {
            logger_1.logger.info('Starting token verification');
            const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN_SECRET);
            const admin = await this._adminRepository.findById(decoded.adminId);
            if (!admin || !admin._id) {
                logger_1.logger.error('Admin not found or user ID is missing');
                throw new Error('Admin not found or user ID is missing');
            }
            const adminRole = admin.role;
            const accessToken = (0, jwtService_1.generateAccessToken)(admin._id.toString(), adminRole);
            logger_1.logger.info('Token verification successful, returning new tokens');
            return {
                accessToken,
            };
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                logger_1.logger.error('Token has expired');
                throw new Error('Refresh token has expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                logger_1.logger.error('Invalid token');
                throw new Error('Invalid refresh token');
            }
            else {
                logger_1.logger.error('Error verifying token:', error);
                throw new Error('Token verification failed');
            }
        }
    }
    async getAllUsers() {
        return await this._adminRepository.getAllUsers();
    }
    async blockUser(userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            return null;
        }
        const updatedUser = await this._userRepository.updateUserDetails(userId, { isBlock: true });
        return updatedUser;
    }
    async unblockUser(userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            return null;
        }
        const updatedUser = await this._userRepository.updateUserDetails(userId, { isBlock: false });
        return updatedUser;
    }
    //-----------------Realated To Tags--------------------------------------------------------------------------------------------------------------//
    async createTag(tagData) {
        const { name } = tagData;
        const existingTag = await this._adminRepository.findOne(name);
        if (existingTag) {
            throw new customErrors_1.BadRequestError("Tag already exists");
        }
        return await this._adminRepository.create(tagData);
    }
    async getAllTags() {
        return this._adminRepository.findAll();
    }
    async updateTags(tagData) {
        const { _id, name } = tagData;
        if (!_id || !name) {
            throw new customErrors_1.BadRequestError("Invalid  Tag Data");
        }
        const updatedTag = await this._adminRepository.updateTagById(_id, { name });
        if (!updatedTag) {
            throw new customErrors_1.BadRequestError("failed to update the data");
        }
        return updatedTag;
    }
    async deleteTag(tag_id) {
        if (!tag_id) {
            throw new customErrors_1.BadRequestError("Invalid Tag ID");
        }
        const deletedTag = await this._adminRepository.deleteTagById(tag_id);
        if (!deletedTag) {
            throw new customErrors_1.BadRequestError("Tag not found or already deleted");
        }
        return deletedTag;
    }
    //-------------------------------------------------------------------------------------------------------------------------------//
    async getAlReports() {
        return this._adminRepository.findAllReportedBlog();
    }
}
exports.AdminUseCase = AdminUseCase;
