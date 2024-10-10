import { Request, Response } from "express";
import { IBlogController } from "../../interfaces/controllers/IBlogController";
import { IBlogUseCase } from "../../interfaces/usecases/IBlogUseCase";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";
import { BlogStatus } from "../../entities/Blog.Post";
import { BadRequestError, NotFoundError } from "../../framework/errors/customErrors";


export class BlogController implements IBlogController{
    constructor(
        private blogUseCase:IBlogUseCase,
       
    ){}

    async createBlogPost(req: Request, res: Response): Promise<Response> {
     
        
        try {
            const { heading, content,tag ,status = BlogStatus.DRAFT} = req.body;
            
            const imageBuffer = req.file?.buffer;
    
            if (!imageBuffer) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json('No image uploaded.');
            }
            const userId = (req as any).user.userId; 
           
            

            if (!userId) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
    
            const imageKey = await this.blogUseCase.uploadImageToS3(imageBuffer, userId);
    
            const newBlogPost = await this.blogUseCase.createBlogPost({
                author_id:userId,
                heading,
                content,
                tag,
                status,
                coverImageUrl: imageKey 
            });
        
             
            return res.status(201).json(newBlogPost);
        } catch (error) {
           logger.error('Error creating blog post:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
    

 
    async  blogEditorImage(req: Request, res: Response) {
        const imageBuffer = req.file?.buffer;
    
        if (!imageBuffer) {
            return res.status(400).send('No image uploaded.');
        }


      try {
        const userId = (req as any).user.userId; 

            if (!userId) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
    
            const imageKey = await this.blogUseCase.uploadImageToS3(imageBuffer, userId);
            return res.status(200).json({ 
                success: 1, 
                url: imageKey 

            });
        
      } catch (error) {
        logger.error('Error uploading image:', error);
        return res.status(500).send('Internal Server Error');
      }
        

    }

    async listBlogs(req: Request, res: Response): Promise<Response> {
      
        try {
            const blogs = await this.blogUseCase.getAllBlogs();

           
            
            return res.status(HttpStatusCode.OK).json(blogs);
        } catch (error) {
            logger.error("Error listing users:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async listTags(req: Request, res: Response): Promise<Response> {
    
      
        try {
            const tag = await this.blogUseCase.getAllTags();
           
            
            return res.status(HttpStatusCode.OK).json(tag);
        } catch (error) {
            logger.error("Error listing blogs:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async singleBlog(req: Request, res: Response): Promise<Response> {
     
        
        try {

            const { id } = req.params;
            if (!id) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Blog ID is required" });
            }
            
            const singleBlog=await this.blogUseCase.getsingleBlog(id);
            
             
            return res.status(HttpStatusCode.OK).json(singleBlog);

            
        } catch (error) {
            logger.error("Error in handling single blog:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to handle singleblog" });
            
        }
    }
    async userBlog(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
    
            if (!userId) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "User ID is required" });
            }
    
            const userBlogs = await this.blogUseCase.userBlogs(userId);
    
            return res.status(HttpStatusCode.OK).json(userBlogs);
        } catch (error) {
            if (error instanceof BadRequestError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
    
            if (error instanceof NotFoundError) {
           
                return res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
            }
    
            logger.error("Error in fetching user blogs:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch user blogs" });
        }
    }
    async deletePost(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
     
        
    
        try {
            const deletedTag = await this.blogUseCase.deletePost(id);
          
            
            return res.status(HttpStatusCode.OK).json(deletedTag);
        } catch (error) {
            logger.error("Error deleting blogpost:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete blogPost" });
        }
    }
    async updatePost(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const blogPostData = req.body
       
        
   
        try {
            const updatedPost = await this.blogUseCase.updateBlog(id, blogPostData);
           
            
            
            return res.status(HttpStatusCode.OK).json(updatedPost);

        } catch (error) {
            logger.error("Error updating blog post:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to update blog post" });
        }
    }
    async singleBlogEdit(req: Request, res: Response): Promise<Response> {
      try {

            const { id } = req.params;
         
            
            if (!id) {
                return res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Blog ID is required" });
            }
            
            const singleBlog=await this.blogUseCase.getsingleBlog(id);
            
             
            return res.status(HttpStatusCode.OK).json(singleBlog);

            
        } catch (error) {
            logger.error("Error in handling single blog:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to handle singleblog" });
            
        }
    }
    
}