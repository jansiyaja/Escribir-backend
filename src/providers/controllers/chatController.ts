import { Request, Response } from "express";
import { IChatController } from "../../interfaces/controllers/IChatController";
import { IChatUseCase } from "../../interfaces/usecases/IChatUseCase";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";
import { BadRequestError } from "../../framework/errors/customErrors";
import Message from "../../framework/models/messages";

export class ChatController implements IChatController{
    constructor(
         private _chatUseCase :IChatUseCase,
    ) { }
    

 async createChat(req: Request, res: Response): Promise<void> {
        try {

            const userId = (req as any).user.userId;
            const { recieverId } = req.params;
            const chat = await this._chatUseCase.createChat(userId, recieverId)

            res.status(HttpStatusCode.OK).json({ chat });

        } catch (error) {
            logger.error("Error creating chat", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

        }
    }
    async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;
            const newMessage = req.body;
            const senderId = (req as any).user.userId;
            const newMessages = await this._chatUseCase.createMessage(senderId, chatId, newMessage.message);

            res.status(HttpStatusCode.OK).json({ newMessages });
        } catch (error) {
            logger.error("Error Sending message", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

        }
    }


    // async getMessages(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { recieverId } = req.params;

    //         const userId = (req as any).user.userId;
    //       const messages = await this._chatUseCase.getChatMessages(recieverId, userId);
            


    //          res.status(HttpStatusCode.OK).json({ messages });
    //     } catch (error) {
    //         logger.error("Error retriving message", error);
    //         res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

    //     }
    // }

      async getMessagesByChatId (req: Request, res: Response) :Promise<void>{
     const { chatId } = req.params; 

     
        
  try {
    
      const messages= await this._chatUseCase.getChatMessage(chatId)
    
      


    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
};

    async interactedUsers(req: Request, res: Response): Promise<void> {
        try {

        const userId = (req as any).user.userId;
            const friendsList = await this._chatUseCase.friendsList(userId);
           res.status(HttpStatusCode.OK).json({ friendsList });
            
        } catch (error) {
           logger.error("Error in getting List of friendsChat", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
   
        }
       
        
    }

       async createGroup(req: Request, res: Response): Promise<void> {

        try {
            const adminId = (req as any).user.userId;
            console.log(req.body);
            
        const { groupName, members } = req.body;
          if (!groupName || !members ) {
                throw new BadRequestError("All fields are required");
            }

            const createGroup = await this._chatUseCase.createGroupChat(adminId, groupName,members)

            res.status(HttpStatusCode.OK).json({ createGroup });
        
            
        }
          catch (error) {
            logger.error("Error creating group chat", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
  
        }
       
    }
     async listGroup(req: Request, res: Response): Promise<void> {

        try {
            const userId = (req as any).user.userId;
           
            
        const matchList = await this._chatUseCase.getGroups(userId)
           res.status(HttpStatusCode.CREATED).json(matchList)
            
        }
          catch (error) {
            logger.error("Error creating group chat", error);
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
  
        }
       
    }
  
 }