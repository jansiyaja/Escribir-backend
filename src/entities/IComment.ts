import { ObjectId } from "mongoose";

 export interface IComment  {
    content: string;
    userId: ObjectId;
    postId: ObjectId; 
    createdAt: Date;
    parentCommentId: ObjectId | null
}