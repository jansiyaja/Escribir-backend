"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepositroy = void 0;
const Blog_1 = require("../../entities/Blog");
const blog_1 = __importDefault(require("../../framework/models/blog"));
const tag_1 = __importDefault(require("../../framework/models/tag"));
const report_1 = __importDefault(require("../../framework/models/report"));
class BlogRepositroy {
    async create(blogPostData) {
        const blogPost = new blog_1.default(blogPostData);
        return await blogPost.save();
    }
    async findAll() {
        const blogs = await blog_1.default.find({ status: Blog_1.BlogStatus.PUBLISHED })
            .populate('author_id', 'username image')
            .sort({ createdAt: -1 });
        return blogs;
    }
    async findById(id) {
        return await blog_1.default.findById(id)
            .populate('author_id', '_id username image')
            .populate('reactions')
            .populate('comments')
            .exec();
    }
    async update(id, blogPostData) {
        const updatedPost = await blog_1.default.findByIdAndUpdate(id, blogPostData, { new: true });
        if (!updatedPost) {
            throw new Error('Blog not found');
        }
        return updatedPost;
    }
    async delete(id) {
        return await blog_1.default.findByIdAndDelete(id);
    }
    async findAllTags() {
        return await tag_1.default.find().sort({ createdAt: -1 });
    }
    async findByUserId(authorId) {
        return await blog_1.default.find({ author_id: authorId })
            .populate("author_id", "username image")
            .exec();
    }
    async createReport(report) {
        const newReport = new report_1.default(report);
        return await newReport.save();
    }
}
exports.BlogRepositroy = BlogRepositroy;
