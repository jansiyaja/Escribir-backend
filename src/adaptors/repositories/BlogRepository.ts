import { BlogStatus, IBlogPost } from "../../entities/Blog.Post";
import { IBlogRepository } from "../../interfaces/repositories/IBlogRepository";
import BlogPost from "../../framework/models/blog";
import { ITag } from "../../entities/ITag";
import TagModel from "../../framework/models/tag";
import { ObjectId } from "mongoose";

export class BlogRepositroy implements IBlogRepository{
    async create(blogPostData: Partial<IBlogPost>): Promise<IBlogPost> {
        const blogPost = new BlogPost(blogPostData);
        return await blogPost.save();
    }
    async findAll(): Promise<IBlogPost[]> {
        const blogs = await BlogPost.find({ status:BlogStatus.PUBLISHED })
        .populate('author_id', 'username image')
        .sort({ createdAt: -1 });
    return blogs
    }


    async findById(id: string): Promise<IBlogPost | null> {
        return await BlogPost.findById(id)
        .populate('author_id', 'username image');
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
      
}