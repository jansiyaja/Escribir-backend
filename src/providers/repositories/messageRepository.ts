import { ObjectId } from "mongoose";
import { IMessage } from "../../entities/IMessage";
import Message from "../../framework/models/messages";
import { IMessageRepository } from "../../interfaces/repositories/IMessageRepository";




export class MessageRepository implements IMessageRepository{
  async createMessage(senderId: string, chatId: string, content: string): Promise<IMessage> {
    const newMessage = new Message({
      Sender_id: senderId,
      Chat: chatId,
      Content: content
    });
     
      
    return await newMessage.save();
  }

    async getMessagesForChat(chatId:ObjectId ): Promise<IMessage[]> {
    
      
      const messages = await Message.find({ Chat: chatId }).populate('Sender_id').populate('Chat').sort({ createdAt: 1 });
   
     
      
      return messages
  }
}
