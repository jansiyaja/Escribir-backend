"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const httpEnums_1 = require("./httpEnums");
const customErrors_1 = require("../../framework/errors/customErrors");
const logger_1 = require("../../framework/services/logger");
class AdminController {
    constructor(_adminUseCase) {
        this._adminUseCase = _adminUseCase;
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            console.log(req.body);
            if (!email || !password) {
                res
                    .status(httpEnums_1.HttpStatusCode.BAD_REQUEST)
                    .json({ error: "Email and password are required" });
            }
            const { user, accessToken, refreshToken } = await this._adminUseCase.loginAdmin({ email, password });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 15 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(httpEnums_1.HttpStatusCode.OK).json({ user });
        }
        catch (error) {
            console.error("Login error:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ message: "Internal server error" });
        }
    }
    async logout(req, res) {
        try {
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
            res
                .status(httpEnums_1.HttpStatusCode.OK)
                .json({ message: "Logged out successfully" });
        }
        catch (error) {
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to log out" });
        }
    }
    async verifyToken(req, res) {
        console.log("iam inside the verify token");
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res
                    .status(httpEnums_1.HttpStatusCode.UNAUTHORIZED)
                    .json({ message: "Refresh token is missing" });
            }
            const { accessToken } = await this._adminUseCase.verifyToken(refreshToken);
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "development",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 15 * 60 * 1000,
            });
            res.status(httpEnums_1.HttpStatusCode.OK).json({ accessToken });
        }
        catch (error) {
            res
                .status(httpEnums_1.HttpStatusCode.UNAUTHORIZED)
                .json({ message: "Invalid refresh token" });
        }
    }
    async listUsers(req, res) {
        try {
            const users = await this._adminUseCase.getAllUsers();
            res.status(httpEnums_1.HttpStatusCode.OK).json(users);
        }
        catch (error) {
            console.error("Error listing users:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to list users" });
        }
    }
    async blockUser(req, res) {
        console.log("iam here in the block user ", req.body);
        try {
            const { userId } = req.body;
            if (!userId) {
                res
                    .status(httpEnums_1.HttpStatusCode.BAD_REQUEST)
                    .json({ error: "User ID is required" });
            }
            const blockedUser = await this._adminUseCase.blockUser(userId);
            if (!blockedUser) {
                res.status(httpEnums_1.HttpStatusCode.NOT_FOUND).json({ error: "User not found" });
            }
            res
                .status(httpEnums_1.HttpStatusCode.OK)
                .json({ message: "User blocked successfully", user: blockedUser });
        }
        catch (error) {
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to block user" });
        }
    }
    async unBlockUser(req, res) {
        try {
            const { userId } = req.body;
            if (!userId) {
                res
                    .status(httpEnums_1.HttpStatusCode.BAD_REQUEST)
                    .json({ error: "User ID is required" });
            }
            const unblockedUser = await this._adminUseCase.unblockUser(userId);
            if (!unblockedUser) {
                res.status(httpEnums_1.HttpStatusCode.NOT_FOUND).json({ error: "User not found" });
            }
            res
                .status(httpEnums_1.HttpStatusCode.OK)
                .json({ message: "User blocked successfully", user: unblockedUser });
        }
        catch (error) {
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to unblock user" });
        }
    }
    async createTag(req, res) {
        logger_1.logger.info(req.body);
        try {
            const { name } = req.body;
            if (!name) {
                throw new customErrors_1.BadRequestError("tagName is Required");
            }
            const createdTag = await this._adminUseCase.createTag({ name: name });
            res.status(httpEnums_1.HttpStatusCode.CREATED).json({
                message: "Tag created successfully",
                tag: createdTag,
            });
        }
        catch (error) {
            logger_1.logger.error(error);
            if (error instanceof customErrors_1.BadRequestError) {
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: error.message });
            }
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to create tag" });
        }
    }
    async listTags(req, res) {
        try {
            const tag = await this._adminUseCase.getAllTags();
            res.status(httpEnums_1.HttpStatusCode.OK).json(tag);
        }
        catch (error) {
            logger_1.logger.error("Error listing users:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to list tags" });
        }
    }
    async updateTag(req, res) {
        const { tagId } = req.params;
        const { name } = req.body;
        try {
            const updatedTag = await this._adminUseCase.updateTags({
                _id: tagId,
                name,
            });
            res.status(httpEnums_1.HttpStatusCode.OK).json(updatedTag);
        }
        catch (error) {
            logger_1.logger.error("Error updating tag:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to update tag" });
        }
    }
    async deleteTag(req, res) {
        const { tagId } = req.params;
        try {
            const deletedTag = await this._adminUseCase.deleteTag(tagId);
            res.status(httpEnums_1.HttpStatusCode.OK).json(deletedTag);
        }
        catch (error) {
            logger_1.logger.error("Error deleting tag:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to delete tag" });
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async listBlogs(req, res) {
        try {
            const blog = await this._adminUseCase.getAllBlogs();
            res.status(httpEnums_1.HttpStatusCode.OK).json(blog);
        }
        catch (error) {
            console.error("Error listing users:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to list users" });
        }
    }
    async listOfReports(req, res) {
        try {
            const reports = await this._adminUseCase.getAlReports();
            res.status(httpEnums_1.HttpStatusCode.OK).json(reports);
        }
        catch (error) {
            logger_1.logger.error("Error listing users:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to list Reporedblog" });
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async listClient(req, res) {
        try {
            const client = await this._adminUseCase.getAllClient();
            res.status(httpEnums_1.HttpStatusCode.OK).json(client);
        }
        catch (error) {
            console.error("Error listing users:", error);
            res
                .status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json({ error: "Failed to list users" });
        }
    }
}
exports.AdminController = AdminController;
