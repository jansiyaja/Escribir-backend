import { Request, Response } from "express";


export interface ITagController{
  
    listTags(req: Request, res: Response): Promise<void> 
    trendTags(req: Request, res: Response): Promise<void> 
    TagByBlogs(req: Request, res: Response): Promise<void> 
}