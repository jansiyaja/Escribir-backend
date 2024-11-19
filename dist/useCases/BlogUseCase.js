"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostUseCase = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const customErrors_1 = require("../framework/errors/customErrors");
const logger_1 = require("../framework/services/logger");
const IReport_1 = require("../entities/IReport");
const reactionEmojis = {
    like: '👍',
    happy: '😄',
    sad: '😢',
    angry: '😡',
    love: '😍'
};
class BlogPostUseCase {
    constructor(_blogRepository, _s3, _reactionRepository, _notificationRepo, _commentRepository) {
        this._blogRepository = _blogRepository;
        this._s3 = _s3;
        this._reactionRepository = _reactionRepository;
        this._notificationRepo = _notificationRepo;
        this._commentRepository = _commentRepository;
    }
    async createBlogPost(blogPostData) {
        return await this._blogRepository.create(blogPostData);
    }
    async uploadImageToS3(buffer, mimeType) {
        console.log("image uploader");
        const key = this.generateRandomKey();
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        };
        console.log("image uploader PARAMS");
        const command = new client_s3_1.PutObjectCommand(params);
        try {
            await this._s3.send(command);
            console.log("image  PARAMS");
            const image = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            console.log(image);
            return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        }
        catch (error) {
            console.error('Error uploading image to S3:', error);
            throw new Error('Could not upload image to S3');
        }
    }
    generateRandomKey() {
        return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    async getAllBlogs() {
        return this._blogRepository.findAll();
    }
    async getAllTags() {
        return this._blogRepository.findAllTags();
    }
    async getsingleBlog(blogId) {
        const singleBlog = await this._blogRepository.findById(blogId);
        if (!singleBlog) {
            throw new customErrors_1.NotFoundError("Blog ID is invalid");
        }
        return { blog: singleBlog };
    }
    async userBlogs(userId) {
        const userBlogs = await this._blogRepository.findByUserId(userId);
        if (!userBlogs || userBlogs.length === 0) {
            throw new customErrors_1.NotFoundError("No blogs found for the provided user ID.");
        }
        return { blogs: userBlogs };
    }
    async deletePost(postId) {
        if (!postId) {
            throw new customErrors_1.BadRequestError("Invalid blogPost ID");
        }
        const deletedPost = await this._blogRepository.delete(postId);
        if (!deletedPost) {
            throw new customErrors_1.BadRequestError("BlogPost not found or already deleted");
        }
        return deletedPost;
    }
    async updateBlog(id, blogData) {
        try {
            const blog = await this._blogRepository.findById(id);
            if (!blog) {
                throw new Error('Blog not found');
            }
            const updatedBlogData = {
                ...blogData
            };
            await this._blogRepository.update(id, updatedBlogData);
            const updatedblog = await this._blogRepository.findById(id);
            if (!updatedblog) {
                throw new Error('blogis not updated');
            }
            return updatedblog;
        }
        catch (error) {
            logger_1.logger.error("Error updating user profile", error);
            throw new Error('Failed to update user profile');
        }
    }
    async reportBlog(id, userId, reason) {
        const blogPost = await this._blogRepository.findById(id);
        if (!blogPost) {
            throw new Error('Blog post not found');
        }
        const report = {
            blogPostId: blogPost._id.toString(),
            authorId: blogPost.author_id,
            reporterId: userId,
            reason: reason,
            reportedAt: new Date(),
            status: IReport_1.ReportStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this._blogRepository.createReport(report);
        return blogPost;
    }
    async addReaction(blogPostId, userId, reactionType, autherId) {
        const validReactionTypes = ['like', 'love', 'happy', 'sad', 'angry'];
        if (!validReactionTypes.includes(reactionType.toLowerCase())) {
            throw new Error("Invalid reaction type");
        }
        const existingReaction = await this._reactionRepository.findReaction(blogPostId, userId, reactionType);
        if (existingReaction) {
            await this._reactionRepository.removeReaction(blogPostId, userId, reactionType);
        }
        const blog = await this._blogRepository.findById(blogPostId);
        if (!blog) {
            throw new Error('Blog not found');
        }
        const blogUserId = blog.author_id;
        if (!blogUserId) {
            throw new Error('Blog user not found');
        }
        const emoji = reactionEmojis[reactionType.toLowerCase()];
        await this._notificationRepo.sendNotification(autherId, userId, `reacted to your post with ${emoji}`);
        return await this._reactionRepository.addReaction(blogPostId, userId, reactionType);
    }
    async removeReaction(reactionId, userId, reactionType, autherId) {
        const emoji = reactionEmojis[reactionType.toLowerCase()];
        const delet = await this._notificationRepo.deleteNotification(userId, autherId, `reacted to your post with ${emoji}`);
        console.log(delet);
        await this._reactionRepository.removeReaction(reactionId, userId, reactionType.toString());
    }
    async addComment(postId, userId, content, autherId) {
        const blogPost = await this._blogRepository.findById(postId);
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
}
exports.BlogPostUseCase = BlogPostUseCase;
