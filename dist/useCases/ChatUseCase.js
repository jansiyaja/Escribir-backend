"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatUseCase = void 0;
const customErrors_1 = require("../framework/errors/customErrors");
class ChatUseCase {
    constructor(_userRepository, _chatRepository, _messageRepository) {
        this._userRepository = _userRepository;
        this._chatRepository = _chatRepository;
        this._messageRepository = _messageRepository;
    }
    async createChat(userId, receiverId) {
        let chat = await this._chatRepository.findChatBetweenUsers(userId, receiverId);
        if (!chat) {
            chat = await this._chatRepository.createChat(userId, receiverId);
        }
        return chat;
    }
    async createMessage(senderId, chatId, content) {
        const newMessage = await this._messageRepository.createMessage(senderId, chatId, content);
        await this._chatRepository.updateLatestMessage(chatId, newMessage._id);
        return newMessage;
    }
    async getChatMessages(userId, receiverId) {
        let chat = await this._chatRepository.findChatBetweenUsers(userId, receiverId);
        const ChatId = chat?._id;
        if (!ChatId) {
            throw new customErrors_1.BadRequestError("there is no create users");
        }
        const chats = await this._messageRepository.getMessagesForChat(ChatId);
        return chats;
    }
    async friendsList(userId) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const friendsList = await this._chatRepository.findFriends(userId);
        return friendsList;
    }
    async createGroupChat(adminId, groupName, Users) {
        let chat = await this._chatRepository.createGroupChat(adminId, groupName, Users);
        return chat;
    }
    async getGroups(userId) {
        let listGroups = await this._chatRepository.listGroups(userId);
        return listGroups;
    }
    async getChatMessage(chatId) {
        let messages = await this._chatRepository.findChat(chatId);
        return messages;
    }
}
exports.ChatUseCase = ChatUseCase;
