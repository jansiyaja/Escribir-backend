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
            logger_1.logger.info('Image buffer received:', imageBuffer ? 'Yes' : 'No');
            if (!imageBuffer) {
                logger_1.logger.warn('No image uploaded.');
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json('No image uploaded.');
                return;
            }
            const userId = req.user.userId;
            logger_1.logger.info('User ID:', userId);
            if (!userId) {
                logger_1.logger.warn('User not authenticated');
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }
            logger_1.logger.info('Uploading image to S3');
            const imageKey = await this._blogUseCase.uploadImageToS3(imageBuffer, userId);
            logger_1.logger.info('Image uploaded to S3 with key:', imageKey);
            logger_1.logger.info('Creating new blog post');
            const newBlogPost = await this._blogUseCase.createBlogPost({
                author_id: userId,
                heading,
                content,
                tag,
                status,
                coverImageUrl: imageKey
            });
            logger_1.logger.info('New blog post created:', newBlogPost);
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
            logger_1.logger.warn('No image uploaded.');
            res.status(400).send('No image uploaded.');
            return;
        }
        try {
            const userId = req.user.userId;
            if (!userId) {
                logger_1.logger.warn('User not authenticated');
                res.status(httpEnums_1.HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
                return;
            }
            logger_1.logger.info('Uploading image to S3');
            const imageKey = await this._blogUseCase.uploadImageToS3(imageBuffer, userId);
            logger_1.logger.info('Image uploaded to S3 with key:', imageKey);
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
            logger_1.logger.info('Fetching all blogs');
            const blogs = await this._blogUseCase.getAllBlogs();
            res.status(httpEnums_1.HttpStatusCode.OK).json(blogs);
        }
        catch (error) {
            logger_1.logger.error('Error listing blogs:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to list blogs' });
        }
    }
    async listTags(req, res) {
        try {
            logger_1.logger.info('Fetching all tags');
            const tags = await this._blogUseCase.getAllTags();
            logger_1.logger.info('Tags fetched:', tags);
            res.status(httpEnums_1.HttpStatusCode.OK).json(tags);
        }
        catch (error) {
            logger_1.logger.error('Error listing tags:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to list tags' });
        }
    }
    async singleBlog(req, res) {
        try {
            const { id } = req.params;
            logger_1.logger.info('Fetching single blog with ID:', id);
            if (!id) {
                logger_1.logger.warn('Blog ID is required');
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: 'Blog ID is required' });
                return;
            }
            const singleBlog = await this._blogUseCase.getsingleBlog(id);
            res.status(httpEnums_1.HttpStatusCode.OK).json(singleBlog);
        }
        catch (error) {
            logger_1.logger.error('Error in handling single blog:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to handle single blog' });
        }
    }
    async userBlog(req, res) {
        try {
            const { userId } = req.params;
            logger_1.logger.info('Fetching blogs for user with ID:', userId);
            if (!userId) {
                logger_1.logger.warn('User ID is required');
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: 'User ID is required' });
                return;
            }
            const userBlogs = await this._blogUseCase.userBlogs(userId);
            logger_1.logger.info('Fetched user blogs:', userBlogs);
            res.status(httpEnums_1.HttpStatusCode.OK).json(userBlogs);
        }
        catch (error) {
            logger_1.logger.error('Error in fetching user blogs:', error);
            if (error instanceof customErrors_1.BadRequestError) {
                res.status(error.statusCode).json({ error: error.message });
            }
            else if (error instanceof customErrors_1.NotFoundError) {
                res.status(httpEnums_1.HttpStatusCode.NOT_FOUND).json({ message: error.message });
            }
            else {
                res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch user blogs' });
            }
        }
    }
    async deletePost(req, res) {
        const { id } = req.params;
        logger_1.logger.info('Deleting blog post with ID:', id);
        try {
            const deletedTag = await this._blogUseCase.deletePost(id);
            logger_1.logger.info('Blog post deleted:', deletedTag);
            res.status(httpEnums_1.HttpStatusCode.OK).json(deletedTag);
        }
        catch (error) {
            logger_1.logger.error('Error deleting blog post:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to delete blog post' });
        }
    }
    async updatePost(req, res) {
        const { id } = req.params;
        const blogPostData = req.body;
        logger_1.logger.info('Updating blog post with ID:', id, 'and data:', blogPostData);
        try {
            const updatedPost = await this._blogUseCase.updateBlog(id, blogPostData);
            logger_1.logger.info('Blog post updated:', updatedPost);
            res.status(httpEnums_1.HttpStatusCode.OK).json(updatedPost);
        }
        catch (error) {
            logger_1.logger.error('Error updating blog post:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to update blog post' });
        }
    }
    async singleBlogEdit(req, res) {
        try {
            const { id } = req.params;
            logger_1.logger.info('Editing single blog with ID:', id);
            if (!id) {
                logger_1.logger.warn('Blog ID is required');
                res.status(httpEnums_1.HttpStatusCode.BAD_REQUEST).json({ error: 'Blog ID is required' });
                return;
            }
            const singleBlog = await this._blogUseCase.getsingleBlog(id);
            res.status(httpEnums_1.HttpStatusCode.OK).json(singleBlog);
        }
        catch (error) {
            logger_1.logger.error('Error in handling single blog:', error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: 'Failed to handle single blog' });
        }
    }
    async reportBlog(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            logger_1.logger.info('Reporting blog with ID:', id, 'by user:', userId);
            const { reason } = req.body;
            const reportedBlog = await this._blogUseCase.reportBlog(id, userId.toString(), reason);
            logger_1.logger.info('Blog reported:', reportedBlog);
            res.status(200).json(reportedBlog);
        }
        catch (error) {
            logger_1.logger.error('Error in reporting blog:', error);
            res.status(500).json({ error: 'Failed to report blog' });
        }
    }
    async addReaction(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.userId;
            const { reaction, autherId } = req.body;
            logger_1.logger.info('Adding reaction:', reaction, 'for blog ID:', id, 'by user:', userId);
            const reactionType = reaction.toLowerCase();
            const newReaction = await this._blogUseCase.addReaction(id, userId, reactionType, autherId);
            logger_1.logger.info('Reaction added:', newReaction);
            res.status(200).json(newReaction);
        }
        catch (error) {
            logger_1.logger.error('Error in adding reaction:', error);
            res.status(500).json({ error: 'Failed to add reaction' });
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
