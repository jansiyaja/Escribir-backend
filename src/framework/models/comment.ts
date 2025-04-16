import mongoose, { Schema } from "mongoose";
import { IComment } from "../../entities/IComment";

const CommentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now },


  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }] ,

  reactions: [
    {
      emoji: { type: String, required: true },
      count: { type: Number, default: 1 },
    },
  ],
}, {
  timestamps: true
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
