"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialUseCase = void 0;
const customErrors_1 = require("../framework/errors/customErrors");
const follow_1 = require("../framework/models/follow");
class SocialUseCase {
    constructor(_userRepository, _notificationRepo, _followRepo) {
        this._userRepository = _userRepository;
        this._notificationRepo = _notificationRepo;
        this._followRepo = _followRepo;
    }
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new Error('You cannot follow yourself');
        }
        const isAlreadyFollowing = await this._followRepo.isFollowing(followerId, followingId);
        if (isAlreadyFollowing) {
            throw new Error('You are already following this user');
        }
        const follower = await this._userRepository.findById(followerId);
        if (!follower) {
            throw new customErrors_1.NotFoundError('Follower not found');
        }
        await this._notificationRepo.sendNotification(followingId, followerId, `${follower.username} has Requested to Follow You!`);
        await this._followRepo.follow(followerId, followingId);
        return "following suucessfully";
    }
    async getFollowStatus(followerId, followingId) {
        const followRecord = await this._followRepo.checkFollowStatus(followerId, followingId);
        if (!followRecord) {
            return 'none';
        }
        if (followRecord.status === follow_1.FollowStatus.PENDING) {
            return 'requested';
        }
        return 'following';
    }
    async followAccept(followerId, followingId) {
        const follower = await this._userRepository.findById(followingId);
        if (!follower) {
            throw new customErrors_1.NotFoundError('Follower not found');
        }
        await this._followRepo.updateFollowStatus(followingId, followerId);
        const updateStatus = await this._followRepo.updateFollowStatus(followerId, followingId);
        await this._notificationRepo.deleteNotification(followingId, followerId, `${follower.username} has Requested to Follow You!`);
        return updateStatus;
    }
    async unfollowUser(followerId, followingId) {
        const isFollowing = await this._followRepo.isFollowing(followerId, followingId);
        if (!isFollowing) {
            throw new Error('You are not following this user');
        }
        await this._followRepo.unfollow(followerId, followingId);
        return 'User unfollowed successfully';
    }
    async getFollowers(userId) {
        return await this._followRepo.getFollowers(userId);
    }
    async isFollowing(followerId, followingId) {
        return await this._followRepo.isFollowing(followerId, followingId);
    }
    async searchUser(userId, searchQuery) {
        const userFollowers = await this._followRepo.getFollowers(userId);
        const filteredFollowers = userFollowers.filter(followerData => {
            return followerData.follower.username.toLowerCase().includes(searchQuery.toLowerCase());
        });
        return filteredFollowers;
    }
}
exports.SocialUseCase = SocialUseCase;
