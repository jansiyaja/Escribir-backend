import express,{ Request, Response } from "express"
import { chatController } from "../framework/utils/dependencyResolver"
import { authenticateToken, checkRole } from "../framework/middleWares/tokenValidator"

export const chatRoute = express.Router();

chatRoute.post('/newChat/:recieverId/',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>chatController.createChat(req,res))
chatRoute.post('/messages/:chatId/',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>chatController.sendMessage(req,res))
chatRoute.get('/messages/:chatId/',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>chatController.getMessagesByChatId(req,res))
chatRoute.get('/interacted',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>chatController.interactedUsers(req,res))
chatRoute.post('/groupscreate',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>chatController.createGroup(req,res))
chatRoute.get('/groups',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>chatController.listGroup(req,res))