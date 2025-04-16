"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
class CommentController {
    constructor(_commentseCase) {
        this._commentseCase = _commentseCase;
    }
    async addComment(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            console.log(userId);
            const { comment, authorId } = req.body;
            console.log(authorId);
            const newComment = await this._commentseCase.addComment(id, userId, comment, authorId);
            res
                .status(201)
                .json({ message: "Reaction added successfully", Comment: newComment });
        }
        catch (error) {
            console.error("Error in adding comments:", error);
            res.status(500).json({ error: "Failed to add comments to the blog" });
        }
    }
    async reactToComment(req, res) {
        try {
            const { commentId } = req.params;
            const { emoji } = req.body;
            console.log(commentId, emoji);
            const updatedComment = await this._commentseCase.reactToComment(commentId, emoji);
            console.log(updatedComment);
            res.status(200).json({
                message: "Reaction added successfully",
                comment: updatedComment,
            });
        }
        catch (error) {
            console.error("Error reacting to comment:", error);
            res.status(500).json({ error: "Failed to react to comment" });
        }
    }
    async replyToComment(req, res) {
        try {
            const { commentId } = req.params;
            const userId = req.user.userId;
            const { content } = req.body;
            console.log(commentId, content);
            const reply = await this._commentseCase.replyToComment(commentId, userId, content);
            console.log(reply);
            res.status(201).json({
                message: "Reply added successfully",
                reply,
            });
        }
        catch (error) {
            console.error("Error replying to comment:", error);
            res.status(500).json({ error: "Failed to add reply" });
        }
    }
}
exports.CommentController = CommentController;
