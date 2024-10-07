import { Request,Response } from "express";

export  interface  IAdminController{
    login(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response> ;

    verifyToken(req: Request, res: Response): Promise<Response>;
    listUsers(req: Request, res: Response): Promise<Response>
    blockUser(req: Request, res: Response): Promise<Response>
    unBlockUser(req: Request, res: Response): Promise<Response>;
    createTag(req: Request, res: Response): Promise<Response>;
    listTags(req: Request, res: Response): Promise<Response>;
    updateTag(req: Request, res: Response): Promise<Response>;
    deleteTag(req: Request, res: Response): Promise<Response> 
    
}