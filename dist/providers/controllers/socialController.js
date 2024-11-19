"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialController = void 0;
const httpEnums_1 = require("./httpEnums");
const logger_1 = require("../../framework/services/logger");
const customErrors_1 = require("../../framework/errors/customErrors");
class SocialController {
    constructor(_socialUseCase) {
        this._socialUseCase = _socialUseCase;
    }
    async followUser(req, res) {
        try {
            const { followingId } = req.params;
            const followerId = req.user.userId;
            const result = await this._socialUseCase.followUser(followerId, followingId);
            res.status(httpEnums_1.HttpStatusCode.OK).json(result);
        }
        catch (error) {
            logger_1.logger.error("Error follow user:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async followStatus(req, res) {
        try {
            const { followingId } = req.params;
            const followerId = req.user.userId;
            const followStatus = await this._socialUseCase.getFollowStatus(followerId, followingId);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ followStatus });
        }
        catch (error) {
            logger_1.logger.error("Error getting follow status:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async followAccept(req, res) {
        try {
            const { followingId } = req.params;
            const followerId = req.user.userId;
            const updatedStatus = await this._socialUseCase.followAccept(followerId, followingId);
            res.status(httpEnums_1.HttpStatusCode.OK).json(updatedStatus);
        }
        catch (error) {
            logger_1.logger.error("Error follow user:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async unfollowUser(req, res) {
        try {
            const { followingId } = req.params;
            console.log(followingId);
            const followerId = req.user.userId;
            const result = await this._socialUseCase.unfollowUser(followerId, followingId);
            res.status(httpEnums_1.HttpStatusCode.OK).json(result);
        }
        catch (error) {
            logger_1.logger.error("Error unfollow user:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async getFollowers(req, res) {
        try {
            const userId = req.user.userId;
            const followers = await this._socialUseCase.getFollowers(userId);
            res.status(200).json(followers);
        }
        catch (error) {
            logger_1.logger.error("Error  in getting followers user:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async searchUser(req, res) {
        const searchQuery = req.query.query;
        const query = searchQuery?.toString();
        if (!query) {
            throw new customErrors_1.BadRequestError('please add a valid name');
        }
        const UserId = req.user.userId;
        try {
            const users = await this._socialUseCase.searchUser(UserId, query);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ users });
        }
        catch (error) {
            logger_1.logger.error("Error searching User", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
}
exports.SocialController = SocialController;
