import { IBlogRepository } from '../interfaces/repositories/IBlogRepository';
import { IBlogPost } from '../entities/Blog';
import { IBlogUseCase } from '../interfaces/usecases/IBlogUseCase';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ITag } from '../entities/ITag';

import { BadRequestError, NotFoundError } from '../framework/errors/customErrors';
import { logger } from '../framework/services/logger';
import { IReport, ReportStatus } from '../entities/IReport';
import { IReactionRepository } from '../interfaces/repositories/IReactionRepository';
import { INotificationRepository } from '../interfaces/repositories/INotificationRepository';
import { IReaction } from '../entities/IReaction';
import { ObjectId } from 'mongoose';



const reactionEmojis: Record<string, string> = {
    like: '👍',
    happy: '😄',
    sad: '😢',
    angry: '😡',
    love: '😍'
};
export class BlogPostUseCase implements IBlogUseCase {
    constructor(
        private _blogRepository: IBlogRepository,
        private _s3: S3Client,
        private _reactionRepository: IReactionRepository,
        private _notificationRepo: INotificationRepository,
   

    ) { }

    async createBlogPost(blogPostData: Partial<IBlogPost>): Promise<IBlogPost> {
        return await this._blogRepository.create(blogPostData);
    }

    async uploadImageToS3(buffer: Buffer, mimeType: string): Promise<string> {
        console.log("image uploader");

        const key = this.generateRandomKey();

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        };
        console.log("image uploader PARAMS");
        const command = new PutObjectCommand(params);

        try {
            await this._s3.send(command);
            console.log("image  PARAMS");
            const image = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
            console.log(image);

            return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        } catch (error) {
            console.error('Error uploading image to S3:', error);
            throw new Error('Could not upload image to S3');
        }
    }

    private generateRandomKey(): string {

        return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }

    async getAllBlogs(): Promise<IBlogPost[]> {
        return this._blogRepository.findAll()
    }

    async getsingleBlog(blogId: string,userId:string): Promise<{ blog: IBlogPost }> {

        const singleBlog = await this._blogRepository.findById(blogId);
 await this._blogRepository.addView(blogId,userId)

        if (!singleBlog) {
            throw new NotFoundError("Blog ID is invalid");
        }



        return { blog: singleBlog };
    }
    async userBlogs(userId: string): Promise<{ blogs: IBlogPost[] }> {

        const userBlogs = await this._blogRepository.findByUserId(userId);


        if (!userBlogs || userBlogs.length === 0) {
            throw new NotFoundError("No blogs found for the provided user ID.");
        }


        return { blogs: userBlogs };
    }
    async deletePost(postId: string): Promise<IBlogPost> {
        if (!postId) {
            throw new BadRequestError("Invalid blogPost ID");
        }

        const deletedPost = await this._blogRepository.delete(postId);

        if (!deletedPost) {
            throw new BadRequestError("BlogPost not found or already deleted");
        }

        return deletedPost;
    }
    async updateBlog(id: string, blogData: Partial<IBlogPost>): Promise<IBlogPost> {


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

        } catch (error) {
            logger.error("Error updating user profile", error);
            throw new Error('Failed to update user profile');
        }

    }


    async reportBlog(id: string, userId: string, reason: string): Promise<any> {

        const blogPost = await this._blogRepository.findById(id);
        if (!blogPost) {
            throw new Error('Blog post not found');
        }


        const report: IReport = {
            blogPostId: blogPost._id.toString(),
            authorId: blogPost.author_id,
            reporterId: userId,
            reason: reason,
            reportedAt: new Date(),
            status: ReportStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await this._blogRepository.createReport(report);


        return blogPost;
    }
    async addReaction(blogPostId: string, userId: string, reactionType: string, autherId: string): Promise<IReaction> {
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

        await this._notificationRepo.sendNotification(autherId, userId, `reacted to your post with ${emoji}`,);

        return await this._reactionRepository.addReaction(blogPostId, userId, reactionType);
    }

    async removeReaction(reactionId: string, userId: string, reactionType: string, autherId: string): Promise<void> {
        const emoji = reactionEmojis[reactionType.toLowerCase()];

        const delet = await this._notificationRepo.deleteNotification(userId, autherId, `reacted to your post with ${emoji}`)
        console.log(delet);


        await this._reactionRepository.removeReaction(reactionId, userId, reactionType.toString());

    }


  async getAllTags(): Promise<ITag[]> {
        return this._blogRepository.findAllTags()
    }

    async getTagBYBlogs(tag: string): Promise<IBlogPost[]> {
        const blogs = await this._blogRepository.findBlogsByTag(tag);


        return blogs;
    }

     async getTrendingTags(): Promise<{ tag: string, views: number }[]> {
        
        const blogs = await this._blogRepository.findAll();

        const tagViewCounts: { [tag: string]: Set<ObjectId> } = {};

        blogs.forEach(blog => {
            const uniqueViews = new Set(blog.viewedBy);

            uniqueViews.forEach(userId => {
                if (tagViewCounts[blog.tag]) {
                    tagViewCounts[blog.tag].add(userId);
                } else {
                    tagViewCounts[blog.tag] = new Set([userId]);
                }
            });
        });

        const sortedTags = Object.entries(tagViewCounts)
            .map(([tag, users]) => ({ tag, views: users.size })) 
            .sort((a, b) => b.views - a.views); 

        return sortedTags;
    }

async getTrendingBlogs(): Promise<(IBlogPost & { views: number })[]> {
  const blogs = await this._blogRepository.findAll();

  const blogViewCounts: { [blogId: string]: Set<ObjectId> } = {};

  blogs.forEach(blog => {
    const uniqueViews = new Set(blog.viewedBy);

    uniqueViews.forEach(userId => {
      if (blogViewCounts[blog._id]) {
        blogViewCounts[blog._id].add(userId);
      } else {
        blogViewCounts[blog._id] = new Set([userId]);
      }
    });
  });

  const sortedBlogs = Object.entries(blogViewCounts)
    .map(([blogId, users]) => {
      const blog = blogs.find(b => b._id.toString() === blogId);
      if (!blog) return null;

      return {
        ...blog,
        views: users.size
      };
    })
    .filter((b): b is IBlogPost & { views: number } => b !== null)
    .sort((a, b) => b.views - a.views);

   
    
  return sortedBlogs;
}







}




