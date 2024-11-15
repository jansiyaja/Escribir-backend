import { Request, Response } from "express";


export interface ISocialController{
  
    followUser(req: Request, res: Response): Promise<void>;
    followAccept(req: Request, res: Response): Promise<void>;
    followStatus(req: Request, res: Response): Promise<void> 
    unfollowUser(req: Request, res: Response): Promise<void>
    getFollowers(req: Request, res: Response): Promise<void> 
     searchUser(req: Request, res: Response): Promise<void>;
}