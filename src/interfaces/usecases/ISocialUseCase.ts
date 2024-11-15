import { IFollow } from "../../framework/models/follow";

export interface ISocialUseCase { 

    
  followUser(followerId: string, followingId: string): Promise<string>;

   getFollowStatus(followerId: string, followingId: string): Promise<'none' | 'requested' | 'following'>;

   followAccept(followerId: string, followingId: string):  Promise<IFollow| null>;

   unfollowUser(followerId: string, followingId: string): Promise<string> ;

    getFollowers(userId: string): Promise<any[]>;
searchUser(userId: string, searchQuery: string): Promise<IFollow[] | null>;
}