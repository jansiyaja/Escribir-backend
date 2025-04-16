import { IChat } from "../../entities/IChat";
import { IMessage } from "../../entities/IMessage";

export interface IChatUseCase { 

  createChat(userId: string, receiverId: string): Promise<IChat>;
  createMessage(senderId: string, chatId: string, content: string): Promise<IMessage>;
   getChatMessage(chatId: string): Promise<IMessage[] |null>

  friendsList(userId: string): Promise<{ userId: string; username: string; image: string }[] | null> 
   createGroupChat(adminId: string, groupName: string, members: string[]): Promise<IChat>;
  getGroups(userId: string): Promise<IChat[]>
     
}