"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chat_1 = __importDefault(require("../../framework/models/chat"));
const logger_1 = require("../../framework/services/logger");
const messages_1 = __importDefault(require("../../framework/models/messages"));
class ChatRepository {
    async findChatBetweenUsers(userId, receiverId) {
        const chat = await chat_1.default.findOne({
            Users: { $all: [userId, receiverId] },
            IsGroupChat: false
        });
        return chat;
    }
    async findChat(chatId) {
        const messages = await messages_1.default.find({ Chat: chatId })
            .populate('Sender_id', 'username image')
            .populate('Chat')
            .sort({ createdAt: 1 });
        return messages;
    }
    async createChat(userId, receiverId) {
        const newChat = new chat_1.default({
            Users: [userId, receiverId],
            IsGroupChat: false,
        });
        return await newChat.save();
    }
    async updateLatestMessage(chatId, messageId) {
        return await chat_1.default.findByIdAndUpdate(chatId, { LatestMessage: messageId }, { new: true });
    }
    async findFriends(userId) {
        try {
            const chatsWithUser = await chat_1.default.aggregate([
                { $match: { Users: new mongoose_1.default.Types.ObjectId(userId) } },
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
            const uniqueFriendsSet = new Set();
            // Define the type for uniqueFriends array
            const uniqueFriends = [];
            chatsWithUser.forEach((chat) => {
                if (chat.Users._id.toString() !== userId) {
                    const friendData = JSON.stringify({
                        chatId: chat.chatId,
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
        }
        catch (error) {
            console.error('Error finding friends:', error);
            throw error;
        }
    }
    async createGroupChat(adminId, groupName, recievers) {
        const newChat = new chat_1.default({
            Users: [adminId, ...recievers],
            IsGroupChat: true,
            GroupAdmin: adminId,
            ChatName: groupName
        });
        return await newChat.save();
    }
    async listGroups(userId) {
        try {
            const groups = await chat_1.default.find({
                IsGroupChat: true,
                Users: userId
            }).populate('Users', 'username image').populate('LatestMessage').populate('GroupAdmin', 'username image');
            return groups;
        }
        catch (error) {
            logger_1.logger.error('Error fetching groups:', error);
            throw new Error('Unable to fetch groups');
        }
    }
}
exports.ChatRepository = ChatRepository;
