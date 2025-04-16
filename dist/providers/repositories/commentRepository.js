"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const blog_1 = __importDefault(require("../../framework/models/blog"));
const comment_1 = __importDefault(require("../../framework/models/comment"));
class CommentRepository {
    async addComment(blogPostId, userId, content) {
        const newComment = new comment_1.default({
            postId: blogPostId,
            content: content,
            userId: userId
        });
        const savedComment = await newComment.save();
        await blog_1.default.findByIdAndUpdate(blogPostId, { $addToSet: { comments: newComment._id } }, { new: true });
        return savedComment;
    }
    async findComment(blogPostId, userId, content) {
        const exixst = await comment_1.default.findOne({ postId: blogPostId,
            content: content,
            userId: userId
        });
        console.log(exixst);
        return "that is alredyExist";
    }
    async reactToComment(commentId, emoji) {
        const comment = await comment_1.default.findById(commentId)
            .populate('replies')
            .sort({ createdAt: -1 });
        if (!comment) {
            throw new Error("Comment not found");
        }
        const existingReaction = comment.reactions.find((r) => r.emoji === emoji);
        if (existingReaction) {
            existingReaction.count += 1;
        }
        else {
            comment.reactions.push({ emoji, count: 1 });
        }
        const updatedComment = await comment.save();
        return updatedComment;
    }
    async replyToComment(parentCommentId, userId, content) {
        const parentComment = await comment_1.default.findById(parentCommentId);
        if (!parentComment) {
            throw new Error("Parent comment not found");
        }
        const replyComment = new comment_1.default({
            postId: parentComment.postId,
            content,
            userId,
            parentCommentId,
        });
        const savedReply = await replyComment.save();
        parentComment.replies.push(savedReply._id);
        await parentComment.save();
        return savedReply;
    }
}
exports.CommentRepository = CommentRepository;
