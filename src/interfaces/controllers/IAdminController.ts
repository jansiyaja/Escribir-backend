import { Request,Response } from "express";

export  interface  IAdminController{
    login(req: Request, res: Response): Promise<Response>;
    logout(req: Request, res: Response): Promise<Response> ;
    listUsers(req: Request, res: Response): Promise<Response>
    
}