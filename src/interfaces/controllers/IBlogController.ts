import { Request,Response } from "express";

export interface IBlogController{
    createBlogPost(req:Request,res:Response):Promise<void>;
    listBlogs(req: Request, res: Response):Promise<void> ;
    singleBlog(req: Request, res: Response):Promise<void>
    userBlog(req: Request, res: Response):Promise<void>;
    deletePost(req: Request, res: Response):Promise<void> ;
    updatePost(req: Request, res: Response):Promise<void>;
    reportBlog(req: Request, res: Response): Promise<void>;
    
    addReaction(req: Request, res: Response): Promise<void>;
    removeReaction(req: Request, res: Response): Promise<void> 
    
  
    
    
}