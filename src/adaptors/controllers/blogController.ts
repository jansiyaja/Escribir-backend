import { Request, Response } from "express";
import { IBlogController } from "../../interfaces/controllers/IBlogController";
import { IBlogUseCase } from "../../interfaces/usecases/IBlogUseCase";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";


export class BlogController implements IBlogController{
    constructor(
        private blogUseCase:IBlogUseCase
    ){}

    async createBlogPost(req: Request, res: Response): Promise<Response> {
        try {
            const { heading, content,tag } = req.body;
            
            const imageBuffer = req.file?.buffer;
    
            if (!imageBuffer) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json('No image uploaded.');
            }
            const userId = (req as any).user.userId; 
            console.log("inside the blogconrtroller",userId);
            

            if (!userId) {
                return res.status(HttpStatusCode.UNAUTHORIZED).json({ error: 'User not authenticated' });
            }
    
            const imageKey = await this.blogUseCase.uploadImageToS3(imageBuffer, userId);
    
            const newBlogPost = await this.blogUseCase.createBlogPost({
                author_id:userId,
                heading,
                content,
                tag,
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
            const users = await this.blogUseCase.getAllBlogs();
            return res.status(HttpStatusCode.OK).json(users);
        } catch (error) {
            logger.error("Error listing users:", error);
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Failed to list users" });
        }
    }
}