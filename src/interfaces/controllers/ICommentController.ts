import { Request, Response } from "express";

export interface ICommentController{
     addComment(req: Request, res: Response): Promise<void>; 
}