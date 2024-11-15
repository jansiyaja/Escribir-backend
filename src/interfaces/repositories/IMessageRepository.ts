import { ObjectId } from "mongoose";
import { IMessage } from "../../entities/IMessage";

export interface IMessageRepository{
    createMessage(senderId: string, chatId: string, content: string): Promise<IMessage>
    getMessagesForChat(chatId: ObjectId): Promise<IMessage[]>
}