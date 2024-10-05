import { IBlogPost } from "../../entities/Blog.Post";
import { IBlogRepository } from "../../interfaces/repositories/IBlogRepository";
import BlogPost from "../../framework/database/models/blog";

export class BlogRepositroy implements IBlogRepository{
    async create(blogPostData: Partial<IBlogPost>): Promise<IBlogPost> {
        const blogPost = new BlogPost(blogPostData);
        return await blogPost.save();
    }
    async findAll(): Promise<IBlogPost[]> {
        return await BlogPost.find().sort({ createdAt: -1 }); 
    }

    // async findById(id: string): Promise<IBlogPost | null> {
    //     return await BlogPost.findById(id);
    // }

    // async update(id: string, blogPostData: Partial<Omit<IBlogPost, '_id' | 'createdAt' | 'updatedAt'>>): Promise<IBlogPost | null> {
    //     return await BlogPost.findByIdAndUpdate(id, blogPostData, { new: true });
    // }

    // async delete(id: string): Promise<IBlogPost | null> {
    //     return await BlogPost.findByIdAndDelete(id);
    // }
}