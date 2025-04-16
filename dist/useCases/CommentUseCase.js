"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentUseCase = void 0;
class CommentUseCase {
    constructor(_blogRepository, _notificationRepo, _commentRepository) {
        this._blogRepository = _blogRepository;
        this._notificationRepo = _notificationRepo;
        this._commentRepository = _commentRepository;
    }
    async addComment(postId, userId, content, autherId) {
        const blogPost = await this._blogRepository.findById(postId);
        console.log(postId, userId, autherId, "=> thisi is usecase add comment");
        if (!blogPost) {
            throw new Error('Blog post not found');
        }
        await this._notificationRepo.sendNotification(autherId, userId, `reacted to your post with ${blogPost.heading}`);
        const aleradyExist = await this._commentRepository.findComment(postId, userId, content);
        if (aleradyExist) {
            console.log("this comment is already exist with same user");
        }
        return await this._commentRepository.addComment(postId, userId, content);
    }
    async reactToComment(commentId, emoji) {
        const comment = await this._commentRepository.reactToComment(commentId, emoji);
        if (!comment)
            throw new Error("Failed to add reaction");
        return comment;
    }
    async replyToComment(parentCommentId, userId, content) {
        return this._commentRepository.replyToComment(parentCommentId, userId, content);
    }
}
exports.CommentUseCase = CommentUseCase;
