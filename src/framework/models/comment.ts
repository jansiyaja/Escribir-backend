import mongoose, { Schema } from "mongoose";
import { IComment } from "../../entities/IComment";

const commentSchema = new Schema<IComment>({
    content: { type: String, required: true },
    userId: {type: mongoose.Types.ObjectId,ref: 'User'},
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    createdAt: { type: Date, default: Date.now },
    parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', default:null}
},{
timestamps:true
}
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);