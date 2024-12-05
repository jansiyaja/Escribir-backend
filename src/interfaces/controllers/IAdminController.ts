import { Request,Response } from "express";

export  interface  IAdminController{
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void> ;

    verifyToken(req: Request, res: Response): Promise<void>;
    listUsers(req: Request, res: Response): Promise<void>
    blockUser(req: Request, res: Response): Promise<void>
    unBlockUser(req: Request, res: Response): Promise<void>;
    createTag(req: Request, res: Response): Promise<void>;
    listTags(req: Request, res: Response): Promise<void>;
    updateTag(req: Request, res: Response): Promise<void>;
    deleteTag(req: Request, res: Response): Promise<void> 
    

    listBlogs(req: Request, res: Response): Promise<void>
    
    listClient(req: Request, res: Response): Promise<void>

}