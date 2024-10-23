import FollowModel, { FollowStatus, IFollow } from "../../framework/models/follow";
import { IFollowRepository } from "../../interfaces/repositories/IFollowRepository";


export default class FollowRepository implements IFollowRepository {
    
    async follow(followerId: string, followingId: string): Promise<void> {
        const follow = new FollowModel({
            follower: followerId,
            following: followingId,
            status:FollowStatus.PENDING
        });
       
         await follow.save();
        
       
    }
    async checkFollowStatus(followerId: string, followingId:string): Promise<IFollow | null> {
       const status= await FollowModel.findOne({ follower: followerId, following: followingId }).exec();
      
       
        return status
    }

    async updateFollowStatus(followerId: string, followingId: string): Promise<IFollow | null> {
       
       const update = await FollowModel.updateOne(
            { follower: followingId, following: followerId },
            { $set: { status:FollowStatus.FULLFILLED} },
            { upsert: true }
        );
        
        const updatedFollow = await FollowModel.findOne({ follower: followingId, following: followerId })
        .populate("follower", "username image");
       
        return updatedFollow;
        
    }

    async unfollow(followerId: string, followingId: string): Promise<void> {
        await FollowModel.deleteOne({ follower: followerId, following: followingId });
    }

   
    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const follow = await FollowModel.findOne({ follower: followerId, following: followingId });
        return !!follow;
    }

    async getFollowers(userId: string): Promise<any[]> {
        return FollowModel.find({ following: userId }).populate('follower', 'username image');
    }

 
   
}
