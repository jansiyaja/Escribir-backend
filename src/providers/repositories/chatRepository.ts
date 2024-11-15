import mongoose from "mongoose";
import { IChat } from "../../entities/IChat";
import ChatModel from "../../framework/models/chat";
import { logger } from "../../framework/services/logger";
import { IChatRepository } from "../../interfaces/repositories/IChatRepository";
import Message from "../../framework/models/messages";
import { IMessage } from "../../entities/IMessage";

export class ChatRepository implements IChatRepository {

    async findChatBetweenUsers(userId: string, receiverId: string): Promise<IChat | null> {
        const chat = await ChatModel.findOne({
            Users: { $all: [userId, receiverId] },
            IsGroupChat: false
        });
        return chat
  }
  
  async findChat(chatId: string): Promise<IMessage[] > {
      
    const messages = await Message.find({ Chat: chatId })
      .populate('Sender_id', 'username image') 
      .populate('Chat') 
          .sort({ createdAt: 1 }); 
       
      
        return messages
  }
  

    async createChat(userId: string, receiverId: string): Promise<IChat> {
        const newChat = new ChatModel({
            Users: [userId, receiverId],
            IsGroupChat: false,
        });

        return await newChat.save();
    }

    async updateLatestMessage(chatId: string, messageId: string): Promise<IChat | null> {
        return await ChatModel.findByIdAndUpdate(
             chatId,
            { LatestMessage: messageId },
            { new: true }
        );
  }
  
async findFriends(userId: string): Promise<{ userId: string; username: string; image: string; latestMessage: string; messageDate: string }[]> {
  try {
    const chatsWithUser = await ChatModel.aggregate([
      { $match: { Users: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'Users',
          foreignField: '_id',
          as: 'Users'
        }
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'LatestMessage',
          foreignField: '_id',
          as: 'LatestMessage'
        }
      },
      { $unwind: '$Users' },
      { $unwind: { path: '$LatestMessage', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          'chatId': '$_id',
          'Users._id': 1,
          'Users.username': 1,
          'Users.image': 1,
          'LatestMessage.Content': 1,
          'LatestMessage.createdAt': 1,
        }
      }
    ]);

    const uniqueFriendsSet = new Set<string>();

    // Define the type for uniqueFriends array
    const uniqueFriends: { userId: string; username: string; image: string; latestMessage: string; messageDate: string }[] = [];

    chatsWithUser.forEach((chat) => {
      if (chat.Users._id.toString() !== userId) {
        const friendData = JSON.stringify({
          chatId:chat.chatId,
          userId: chat.Users._id.toString(),
          username: chat.Users.username,
          image: chat.Users.image,
          latestMessage: chat.LatestMessage?.Content || '',
          date: chat.LatestMessage?.createdAt || '',
        });

        if (!uniqueFriendsSet.has(chat.Users._id.toString())) {
          uniqueFriendsSet.add(chat.Users._id.toString());
          uniqueFriends.push(JSON.parse(friendData));
        }
      }
    });

    return uniqueFriends;
  } catch (error) {
    console.error('Error finding friends:', error);
    throw error;
  }
}



  async createGroupChat(adminId: string, groupName: string, recievers: string[]): Promise<IChat> {
       const newChat = new ChatModel({
            Users: [adminId, ...recievers],
         IsGroupChat: true,
         GroupAdmin: adminId,
          ChatName:groupName
            
        });

        return await newChat.save();
  }
  
  async  listGroups(userId: string): Promise<IChat[]> {
  try {
   
    const groups = await ChatModel.find({
      IsGroupChat: true,        
      Users: userId           
    }).populate('Users', 'username image').populate('LatestMessage',).populate('GroupAdmin', 'username image');


 
    return groups; 
  } catch (error) {
    logger.error('Error fetching groups:', error);
    throw new Error('Unable to fetch groups');
  }
}
}
  

    
