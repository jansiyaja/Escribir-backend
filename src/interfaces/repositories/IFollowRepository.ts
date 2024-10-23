import { IFollow } from "../../framework/models/follow";

export interface IFollowRepository{
    follow(followerId: string, followingId: string): Promise<void>;
    unfollow(followerId: string, followingId: string): Promise<void>;
    isFollowing(followerId: string, followingId: string): Promise<boolean>;
    checkFollowStatus(followerId: string, followingId:string): Promise<IFollow | null>;
    getFollowers(userId: string): Promise<any[]>
  
    updateFollowStatus(followerId: string, followingId: string): Promise<IFollow | null>
}