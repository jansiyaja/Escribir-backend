import mongoose, { ObjectId, Types } from "mongoose";
import { BlogStatus, IBlogPost } from "../../entities/Blog";
import { IBlogRepository } from "../../interfaces/repositories/IBlogRepository";
import BlogPost from "../../framework/models/blog";
import { ITag } from "../../entities/ITag";
import TagModel from "../../framework/models/tag";
import { IReport } from "../../entities/IReport";
import Report from "../../framework/models/report";

export class BlogRepositroy implements IBlogRepository {
    async create(blogPostData: Partial<IBlogPost>): Promise<IBlogPost> {
        const blogPost = new BlogPost(blogPostData);
        return await blogPost.save();
    }
    async findAll(): Promise<IBlogPost[]> {
        const blogs = await BlogPost.find({ status: BlogStatus.PUBLISHED })
            .populate('author_id', 'username image')
            .sort({ createdAt: -1 });
        return blogs
    }


    async findById(id: string): Promise<IBlogPost | null> {
        return await BlogPost.findById(id)
            .populate('author_id', '_id username image')
            .populate('reactions')
            .populate('comments')
            .exec();
    }

    async addView(blogId: string, userId: string): Promise<void> {
  const userObjectId = new Types.ObjectId(userId);

  await BlogPost.findByIdAndUpdate(
    blogId,
    { $addToSet: { viewedBy: userObjectId } }, 
    { new: true }
  );
}


    async update(id: string, blogPostData: Partial<IBlogPost>): Promise<IBlogPost | null> {

        const updatedPost = await BlogPost.findByIdAndUpdate(id, blogPostData, { new: true });
        if (!updatedPost) {
            throw new Error('Blog not found');
        }
        return updatedPost;
    }


    async delete(id: string): Promise<IBlogPost | null> {
        return await BlogPost.findByIdAndDelete(id);
    }

    async findAllTags(): Promise<ITag[]> {
        return await TagModel.find().sort({ createdAt: -1 });
    }
    async findByUserId(authorId: string): Promise<IBlogPost[] | null> {
        return await BlogPost.find({ author_id: authorId })
            .populate("author_id", "username image")
            .exec();

    }
    async createReport(report: IReport): Promise<IReport> {
        const newReport = new Report(report);
        return await newReport.save();
    }


    async findBlogsByTag(tag: string): Promise<IBlogPost[]> {
        const blogs = await BlogPost.find({ tag: tag }).exec();
        return blogs
    }



}