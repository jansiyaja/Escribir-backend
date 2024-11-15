import { Request, Response } from "express";
import { IBlogController } from "../../interfaces/controllers/IBlogController";
import { IBlogUseCase } from "../../interfaces/usecases/IBlogUseCase";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";
import { BlogStatus } from "../../entities/Blog";
import { BadRequestError, NotFoundError } from "../../framework/errors/customErrors";



export class BlogController implements IBlogController{
    constructor(
        private _blogUseCase:IBlogUseCase,
       
    ){}

    async createBlogPost(req: Request, res: Response):Promise<void> {
     
        
        try {
            const { heading, content,tag ,status = BlogStatus.DRAFT} = req.body;
            
            const imageBuffer = req.file?.buffer;

            console.log(req.file );
            
    
            if (!imageBuffer) {
                res.status(HttpStatusCode.UNAUTHORIZED).json('No image uploaded.');
                return;
            }
            const userId = (req as any).user.userId; 
           
            

            if (!userId) {
                 res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
    
            const imageKey = await this._blogUseCase.uploadImageToS3(imageBuffer, userId);
             console.log("image",imageKey );
            const newBlogPost = await this._blogUseCase.createBlogPost({
                author_id:userId,
                heading,
                content,
                tag,
                status,
                coverImageUrl: imageKey 
            });
        
             
             res.status(201).json(newBlogPost);
        } catch (error) {
           logger.error('Error creating blog post:', error);
             res.status(500).send('Internal Server Error');
        }
    }
    

 
    async  blogEditorImage(req: Request, res: Response) {
        const imageBuffer = req.file?.buffer;
    
        if (!imageBuffer) {
            res.status(400).send('No image uploaded.');
            return
        }


      try {
        const userId = (req as any).user.userId; 

            if (!userId) {
                 res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
    
            const imageKey = await this._blogUseCase.uploadImageToS3(imageBuffer, userId);
             res.status(200).json({ 
                success: 1, 
                url: imageKey 

            });
        
      } catch (error) {
        logger.error('Error uploading image:', error);
         res.status(500).send('Internal Server Error');
      }
        

    }

    async listBlogs(req: Request, res: Response):Promise<void> {
      
        try {
            const blogs = await this._blogUseCase.getAllBlogs();

           
            
             res.status(HttpStatusCode.OK).json(blogs);
        } catch (error) {
            logger.error("Error listing users:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async listTags(req: Request, res: Response):Promise<void> {
    
      
        try {
            const tag = await this._blogUseCase.getAllTags();
           
            
             res.status(HttpStatusCode.OK).json(tag);
        } catch (error) {
            logger.error("Error listing blogs:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
    async singleBlog(req: Request, res: Response):Promise<void> {
     
        
        try {

            const { id } = req.params;
            if (!id) {
                 res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Blog ID is required" });
            }
            
            const singleBlog=await this._blogUseCase.getsingleBlog(id);
            
             
             res.status(HttpStatusCode.OK).json(singleBlog);

            
        } catch (error) {
            logger.error("Error in handling single blog:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to handle singleblog" });
            
        }
    }
    async userBlog(req: Request, res: Response):Promise<void> {
        try {
            const { userId } = req.params;
    
            if (!userId) {
                 res.status(HttpStatusCode.BAD_REQUEST).json({ error: "User ID is required" });
            }
    
            const userBlogs = await this._blogUseCase.userBlogs(userId);
    
             res.status(HttpStatusCode.OK).json(userBlogs);
        } catch (error) {
            if (error instanceof BadRequestError) {
                 res.status(error.statusCode).json({ error: error.message });
            }
    
            if (error instanceof NotFoundError) {
           
                 res.status(HttpStatusCode.NOT_FOUND).json({ message: error.message });
            }
    
            logger.error("Error in fetching user blogs:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to fetch user blogs" });
        }
    }
    async deletePost(req: Request, res: Response):Promise<void> {
        const { id } = req.params;
     
        
    
        try {
            const deletedTag = await this._blogUseCase.deletePost(id);
          
            
             res.status(HttpStatusCode.OK).json(deletedTag);
        } catch (error) {
            logger.error("Error deleting blogpost:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete blogPost" });
        }
    }
    async updatePost(req: Request, res: Response):Promise<void> {
        const { id } = req.params;
        const blogPostData = req.body
       
        
   
        try {
            const updatedPost = await this._blogUseCase.updateBlog(id, blogPostData);
           
            
            
             res.status(HttpStatusCode.OK).json(updatedPost);

        } catch (error) {
            logger.error("Error updating blog post:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to update blog post" });
        }
    }
    async singleBlogEdit(req: Request, res: Response):Promise<void> {
      try {

            const { id } = req.params;
         
            
            if (!id) {
                 res.status(HttpStatusCode.BAD_REQUEST).json({ error: "Blog ID is required" });
            }
            
            const singleBlog=await this._blogUseCase.getsingleBlog(id);
            
             
             res.status(HttpStatusCode.OK).json(singleBlog);

            
        } catch (error) {
            logger.error("Error in handling single blog:", error);
             res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to handle singleblog" });
            
        }
    }
    async reportBlog(req: Request, res: Response):Promise<void> {
        try {
            const { id } = req.params; 
            const userId = (req as any).user.userId;  
            const user_id=userId.toString()
            
            const { reason } = req.body;

            const reportedBlog = await this._blogUseCase.reportBlog(id, user_id, reason);

             res.status(200).json(reportedBlog);
        } catch (error) {
            console.error("Error in reporting blog:", error);
             res.status(500).json({ error: "Failed to report blog" });
        }
    }

    async addReaction(req: Request, res: Response):Promise<void> {
        try {
            const { id } = req.params; 
            const userId = (req as any).user.userId; 
            const { reaction ,autherId} = req.body;

            const reactionType = reaction.toLowerCase();
            const newReaction = await this._blogUseCase.addReaction(id, userId, reactionType,autherId);

             res.status(201).json({ message: "Reaction added successfully", reaction: newReaction });
        } catch (error) {
            console.error("Error in adding Reaction:", error);
             res.status(500).json({ error: "Failed to add reaction to the blog" });
        }
    }

     async removeReaction(req: Request, res: Response):Promise<void> {
        try {
            const { id } = req.params;
           
            
             const userId = (req as any).user.userId; 
            const { reaction ,autherId} = req.body;
            console.log(reaction,autherId);
            
            
            const removeReaction = await this._blogUseCase.removeReaction(id,userId,reaction,autherId);
            console.log("remove",removeReaction);
            
             res.status(200).json(removeReaction);
        } catch (error) {
            console.error("Error in removing Reaction:", error);
             res.status(500).json({ error: "Failed to remove reaction from the blog" });
        }
    }
    async addComment(req: Request, res: Response): Promise<void> {
      
        try {
            
            const { id } = req.params; 
            const userId = (req as any).user.userId;
            const { comment, autherId } = req.body
            console.log(req.params, req.body);
            
            

            const newComment = await this._blogUseCase.addComment(id, userId, comment,autherId)
              res.status(201).json({ message: "Reaction added successfully", Comment: newComment });
            
        } catch (error) {
             console.error("Error in adding comments:", error);
             res.status(500).json({ error: "Failed to add comments to the blog" });
            
        }
    }

  

}
    

