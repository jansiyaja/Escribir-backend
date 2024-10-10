import { IBlogRepository } from '../../interfaces/repositories/IBlogRepository';
import { IBlogPost } from '../../entities/Blog.Post'; 
import { IBlogUseCase } from '../../interfaces/usecases/IBlogUseCase';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ITag } from '../../entities/ITag';
import { BadRequestError, NotFoundError } from '../../framework/errors/customErrors';
import { logger } from '../../framework/services/logger';


export class BlogPostUseCase implements IBlogUseCase {
    constructor(
        private _blogRepository: IBlogRepository,
        private _s3: S3Client
    ) {}

    async createBlogPost(blogPostData: Partial<IBlogPost>): Promise<IBlogPost>{
        return await this._blogRepository.create(blogPostData);
    }

    async uploadImageToS3(buffer: Buffer, mimeType: string): Promise<string> {
        const key = this.generateRandomKey(); 
        
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        };

        const command = new PutObjectCommand(params);

        try {
            await this._s3.send(command); 
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
    async getAllTags(): Promise<ITag[]> {
        return this._blogRepository.findAllTags()
    }
    async getsingleBlog(blogId: string): Promise<{ blog: IBlogPost }> {

        const singleBlog = await this._blogRepository.findById(blogId);

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
    async updateBlog( id:string,blogData: Partial<IBlogPost>): Promise<IBlogPost> {
        
      
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
                     
                       

                    return updatedblog ;
            
        } catch (error) {
            logger.error("Error updating user profile", error);
        throw new Error('Failed to update user profile');
        }
            
    }

    
    
    
}
