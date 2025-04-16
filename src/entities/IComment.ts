import mongoose, { ObjectId } from "mongoose";

export interface ICommentReaction {
  emoji: string;
  count: number;
}

export interface IComment {
  content: string;
  userId: ObjectId;
  postId: ObjectId;
  createdAt: Date;
    parentCommentId: ObjectId | null;
      replies: mongoose.Types.ObjectId[];
    reactions: ICommentReaction[];
    
}
