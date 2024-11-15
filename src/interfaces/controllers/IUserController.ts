import { Request,Response } from "express";
 
export interface IUserController {
    register(req: Request, res: Response):  Promise<void> ;
     verifyOTP(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    verifyToken(req: Request, res: Response):  Promise<void>;
     resendOTP(req: Request, res: Response):Promise<void>;
     logout(req: Request, res: Response): Promise<void>;
     profileImageUpload(req: Request, res: Response):Promise<void> 
     getProfile(req: Request, res: Response):Promise<void>;
     friendprofile(req: Request, res: Response): Promise<void> 

    



    getAllNotifications(req: Request, res: Response): Promise<void>;
    sendNotifications(req: Request, res: Response): Promise<void>;
    feedback(req: Request, res: Response): Promise<void>

    

    
}