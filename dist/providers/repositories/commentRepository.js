"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const blog_1 = __importDefault(require("../../framework/models/blog"));
const comment_1 = require("../../framework/models/comment");
class CommentRepository {
    async addComment(blogPostId, userId, content) {
        const newComment = new comment_1.Comment({
            postId: blogPostId,
            content: content,
            userId: userId
        });
        const savedComment = await newComment.save();
        await blog_1.default.findByIdAndUpdate(blogPostId, { $addToSet: { comments: newComment._id } }, { new: true });
        return savedComment;
    }
    async findComment(blogPostId, userId, content) {
        const exixst = await comment_1.Comment.findOne({ postId: blogPostId,
            content: content,
            userId: userId
        });
        console.log(exixst);
        return "that is alredyExist";
    }
}
exports.CommentRepository = CommentRepository;
