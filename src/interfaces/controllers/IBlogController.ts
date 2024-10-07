import { Request,Response } from "express";

export interface IBlogController{
    createBlogPost(req:Request,res:Response):Promise<Response>
}