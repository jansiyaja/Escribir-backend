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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const follow_1 = __importStar(require("../../framework/models/follow"));
class FollowRepository {
    async follow(followerId, followingId) {
        const follow = new follow_1.default({
            follower: followerId,
            following: followingId,
            status: follow_1.FollowStatus.PENDING
        });
        await follow.save();
    }
    async checkFollowStatus(followerId, followingId) {
        const status = await follow_1.default.findOne({ follower: followerId, following: followingId }).exec();
        return status;
    }
    async updateFollowStatus(followerId, followingId) {
        const update = await follow_1.default.updateOne({ follower: followingId, following: followerId }, { $set: { status: follow_1.FollowStatus.FULLFILLED } }, { upsert: true });
        const updatedFollow = await follow_1.default.findOne({ follower: followingId, following: followerId })
            .populate("follower", "username image");
        return updatedFollow;
    }
    async unfollow(followerId, followingId) {
        await follow_1.default.deleteOne({ follower: followerId, following: followingId });
    }
    async isFollowing(followerId, followingId) {
        const follow = await follow_1.default.findOne({ follower: followerId, following: followingId });
        return !!follow;
    }
    async getFollowers(userId) {
        return follow_1.default.find({ following: userId }).populate('follower', 'username image');
    }
}
exports.default = FollowRepository;
