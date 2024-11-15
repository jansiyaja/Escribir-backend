import { IChat } from "../../entities/IChat";
import { IMessage } from "../../entities/IMessage";

export interface IChatRepository{
   findChatBetweenUsers(userId: string, receiverId: string): Promise<IChat | null>
    createChat(userId: string, receiverId: string): Promise<IChat>;
    createGroupChat(adminId: string, groupName: string, recievers: string[]): Promise<IChat>
    updateLatestMessage(chatId: string, messageId: string): Promise<IChat | null>
    findFriends(userId: string): Promise<{ userId: string; username: string; image: string }[]>
    listGroups(userId: string): Promise<IChat[]> 
     findChat(chatId: string): Promise<IMessage[]>
}