import { IChat } from "../entities/IChat";
import { IMessage } from "../entities/IMessage";
import { BadRequestError } from "../framework/errors/customErrors";
import { IChatRepository } from "../interfaces/repositories/IChatRepository";

import { IMessageRepository } from "../interfaces/repositories/IMessageRepository";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { IChatUseCase } from "../interfaces/usecases/IChatUseCase";

export class ChatUseCase implements IChatUseCase{
    constructor(
        private _userRepository: IUserRepository,
        private _chatRepository: IChatRepository,
        private _messageRepository: IMessageRepository,
     
    ) { } 
    

        async createChat(userId: string, receiverId: string): Promise<IChat> {
        
        let chat = await this._chatRepository.findChatBetweenUsers(userId, receiverId);

          if (!chat) {
      
             chat = await this._chatRepository.createChat(userId, receiverId);
          }
     return chat
    }

    async createMessage(senderId: string, chatId: string, content: string): Promise<IMessage> {

        const newMessage = await this._messageRepository.createMessage(senderId, chatId, content);
         
        await this._chatRepository.updateLatestMessage(chatId, newMessage._id);
        return newMessage;
        
    }
    async getChatMessages(userId: string, receiverId: string): Promise<IMessage[]> {
       
        
       
        let chat = await this._chatRepository.findChatBetweenUsers(userId, receiverId);
       
        const ChatId = chat?._id
        if (!ChatId) {
             throw new BadRequestError("there is no create users")
        }
        

        const chats = await this._messageRepository.getMessagesForChat(ChatId);
     
         return  chats

    }
    async friendsList(userId: string): Promise<{ userId: string; username: string; image: string }[] | null>  {
          const user = await this._userRepository.findById(userId);
                  if (!user) {
                       throw new Error('User not found');
        }
        
        const friendsList = await this._chatRepository.findFriends(userId);
        return friendsList;
    }
  
    

   async createGroupChat(adminId: string, groupName: string, Users: string[]): Promise<IChat> {
       
      
     let   chat = await this._chatRepository.createGroupChat(adminId, groupName,Users);
          
     return chat
    
   }
  
    async getGroups(userId: string): Promise<IChat[]> {
        let listGroups = await this._chatRepository.listGroups(userId)
        return listGroups
    }
    async getChatMessage(chatId: string): Promise<IMessage[]> {
        let messages = await this._chatRepository.findChat(chatId);
        return messages
    }
 }