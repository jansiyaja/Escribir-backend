"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogController = void 0;
const httpEnums_1 = require("./httpEnums");
const logger_1 = require("../../framework/services/logger");
const Blog_1 = require("../../entities/Blog");
const customErrors_1 = require("../../framework/errors/customErrors");
class BlogController {
    constructor(_blogUseCase) {
        this._blogUseCase = _blogUseCase;
    }
    async createBlogPost(req, res) {
        try {
            const { heading, content, tag, status = Blog_1.BlogStatus.DRAFT } = req.body;
            const imageBuffer = req.file?.buffer;
            console.log(req.file);
            if (!imageBuffer) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json('No image uploaded.');
                return;
            }
            const userId = req.user.userId;
            if (!userId) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const imageKey = await this._blogUseCase.uploadImageToS3(imageBuffer, userId);
            console.log("image", imageKey);
            const newBlogPost = await this._blogUseCase.createBlogPost({
                author_id: userId,
                heading,
                content,
                tag,
                status,
                coverImageUrl: imageKey
            });
            res.status(201).json(newBlogPost);
        }
        catch (error) {
            logger_1.logger.error('Error creating blog post:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async blogEditorImage(req, res) {
        const imageBuffer = req.file?.buffer;
        if (!imageBuffer) {
            res.status(400).send('No image uploaded.');
            return;
        }
        try {
            const userId = req.user.userId;
            if (!userId) {
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
            const imageKey = await this._blogUseCase.uploadImageToS3(imageBuffer, userId);
            res.status(200).json({
                success: 1,
                url: imageKey
            });
        }
        catch (error) {
            logger_1.logger.error('Error uploading image:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async listBlogs(req, res) {
        try {
            const blogs = await this._blogUseCase.getAllBlogs();
            res.status(httpEnums_1.HttpStatusCode.OK).json(blogs);
        }
        catch (error) {
            logger_1.logger.error("Error listing users:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async listTags(req, res) {
        try {
            const tag = await this._blogUseCase.getAllTags();
            res.status(httpEnums_1.HttpStatusCode.OK).json(tag);
        }
        catch (error) {
            logger_1.logger.error("Error listing blogs:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async singleBlog(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: "Blog ID is required" });
            }
            const singleBlog = await this._blogUseCase.getsingleBlog(id);
            res.status(httpEnums_1.HttpStatusCode.OK).json(singleBlog);
        }
        catch (error) {
            logger_1.logger.error("Error in handling single blog:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to handle singleblog" });
        }
    }
    async userBlog(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: "User ID is required" });
            }
            const userBlogs = await this._blogUseCase.userBlogs(userId);
            res.status(httpEnums_1.HttpStatusCode.OK).json(userBlogs);
        }
        catch (error) {
            if (error instanceof customErrors_1.BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            if (error instanceof customErrors_1.NotFoundError) {
                res.status(httpEnums_1.HttpStatusCode.NOT_FOUND).json({ message: error.message });
            }
            logger_1.logger.error("Error in fetching user blogs:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch user blogs" });
        }
    }
    async deletePost(req, res) {
        const { id } = req.params;
        try {
            const deletedTag = await this._blogUseCase.deletePost(id);
            res.status(httpEnums_1.HttpStatusCode.OK).json(deletedTag);
        }
        catch (error) {
            logger_1.logger.error("Error deleting blogpost:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete blogPost" });
        }
    }
    async updatePost(req, res) {
        const { id } = req.params;
        const blogPostData = req.body;
        try {
            const updatedPost = await this._blogUseCase.updateBlog(id, blogPostData);
            res.status(httpEnums_1.HttpStatusCode.OK).json(updatedPost);
        }
        catch (error) {
            logger_1.logger.error("Error updating blog post:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to update blog post" });
        }
    }
    async singleBlogEdit(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: "Blog ID is required" });
            }
            const singleBlog = await this._blogUseCase.getsingleBlog(id);
            res.status(httpEnums_1.HttpStatusCode.OK).json(singleBlog);
        }
        catch (error) {
            logger_1.logger.error("Error in handling single blog:", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to handle singleblog" });
        }
    }
    async reportBlog(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const user_id = userId.toString();
            const { reason } = req.body;
            const reportedBlog = await this._blogUseCase.reportBlog(id, user_id, reason);
            res.status(200).json(reportedBlog);
        }
        catch (error) {
            console.error("Error in reporting blog:", error);
            res.status(500).json({ error: "Failed to report blog" });
        }
    }
    async addReaction(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const { reaction, autherId } = req.body;
            const reactionType = reaction.toLowerCase();
            const newReaction = await this._blogUseCase.addReaction(id, userId, reactionType, autherId);
            res.status(201).json({ message: "Reaction added successfully", reaction: newReaction });
        }
        catch (error) {
            console.error("Error in adding Reaction:", error);
            res.status(500).json({ error: "Failed to add reaction to the blog" });
        }
    }
    async removeReaction(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const { reaction, autherId } = req.body;
            console.log(reaction, autherId);
            const removeReaction = await this._blogUseCase.removeReaction(id, userId, reaction, autherId);
            console.log("remove", removeReaction);
            res.status(200).json(removeReaction);
        }
        catch (error) {
            console.error("Error in removing Reaction:", error);
            res.status(500).json({ error: "Failed to remove reaction from the blog" });
        }
    }
    async addComment(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const { comment, autherId } = req.body;
            console.log(req.params, req.body);
            const newComment = await this._blogUseCase.addComment(id, userId, comment, autherId);
            res.status(201).json({ message: "Reaction added successfully", Comment: newComment });
        }
        catch (error) {
            console.error("Error in adding comments:", error);
            res.status(500).json({ error: "Failed to add comments to the blog" });
        }
    }
}
exports.BlogController = BlogController;