import { NotFoundError } from "../framework/errors/customErrors";
import { FollowStatus, IFollow } from "../framework/models/follow";
import { IFollowRepository } from "../interfaces/repositories/IFollowRepository";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { ISocialUseCase } from "../interfaces/usecases/ISocialUseCase";

export class SocialUseCase implements ISocialUseCase {
    constructor(
         private _userRepository:IUserRepository,
        private _notificationRepo: INotificationRepository,
        private _followRepo: IFollowRepository,
        

      
    ) { }

   
     async followUser(followerId: string, followingId: string): Promise<string> {
       
        if (followerId === followingId) {
            throw new Error('You cannot follow yourself');
        }

        const isAlreadyFollowing = await this._followRepo.isFollowing(followerId, followingId);
        if (isAlreadyFollowing) {
            throw new Error('You are already following this user');
        }
         const follower = await this._userRepository.findById(followerId);
        if (!follower) {
            throw new NotFoundError('Follower not found');
        }
    

        await this._notificationRepo.sendNotification(followingId, followerId,`${follower.username} has Requested to Follow You!`);
        
       
         await this._followRepo.follow(followerId, followingId);
        return  "following suucessfully"
    }
    

    async getFollowStatus(followerId: string, followingId: string): Promise<'none' | 'requested' | 'following'> {
        const followRecord = await this._followRepo.checkFollowStatus(followerId,followingId);
    
        if (!followRecord) {
          return 'none'; 
        }
    
        if (followRecord.status === FollowStatus.PENDING) {
          return 'requested'; 
        }
         return 'following'; 

   }


    async followAccept(followerId: string, followingId: string): Promise<IFollow | null> {

         const follower = await this._userRepository.findById(followingId);
        if (!follower) {
            throw new NotFoundError('Follower not found');
        }
    
         await this._followRepo.updateFollowStatus(followingId, followerId);

        const updateStatus= await this._followRepo.updateFollowStatus(followerId, followingId);
         await this._notificationRepo.deleteNotification(followingId, followerId,`${follower.username} has Requested to Follow You!`);
        return updateStatus
    }


    async unfollowUser(followerId: string, followingId: string): Promise<string> {
        const isFollowing = await this._followRepo.isFollowing(followerId, followingId);
        if (!isFollowing) {
            throw new Error('You are not following this user');
        }

       
        await this._followRepo.unfollow(followerId, followingId);
        return 'User unfollowed successfully';
    }


    async getFollowers(userId: string): Promise<any[]> {
        return await this._followRepo.getFollowers(userId);
    }


  
    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        return await this._followRepo.isFollowing(followerId, followingId);

    }

     async searchUser(userId: string, searchQuery: string): Promise<IFollow[]| null> {

        const userFollowers = await this._followRepo.getFollowers(userId)
       
        
        
            const filteredFollowers = userFollowers.filter(followerData => {
            return followerData.follower.username.toLowerCase().includes(searchQuery.toLowerCase());
    });

        return filteredFollowers
    }
}