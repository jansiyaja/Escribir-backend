import { Request, Response } from "express";

export interface IChatController{
     sendMessage(req: Request, res: Response): Promise<void>
    createChat(req: Request, res: Response): Promise<void>;
     // getMessages(req: Request, res: Response): Promise<void>
     interactedUsers(req: Request, res: Response): Promise<void>;
     createGroup(req: Request, res: Response): Promise<void>;
    listGroup(req: Request, res: Response): Promise<void>;
    getMessagesByChatId (req: Request, res: Response):Promise<void>
 }