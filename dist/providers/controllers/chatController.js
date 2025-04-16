"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const httpEnums_1 = require("./httpEnums");
const logger_1 = require("../../framework/services/logger");
const customErrors_1 = require("../../framework/errors/customErrors");
class ChatController {
    constructor(_chatUseCase) {
        this._chatUseCase = _chatUseCase;
    }
    async createChat(req, res) {
        try {
            const userId = req.user.userId;
            const { recieverId } = req.params;
            const chat = await this._chatUseCase.createChat(userId, recieverId);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ chat });
        }
        catch (error) {
            logger_1.logger.error("Error creating chat", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async sendMessage(req, res) {
        try {
            const { chatId } = req.params;
            const newMessage = req.body;
            const senderId = req.user.userId;
            const newMessages = await this._chatUseCase.createMessage(senderId, chatId, newMessage.message);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ newMessages });
        }
        catch (error) {
            logger_1.logger.error("Error Sending message", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async getMessagesByChatId(req, res) {
        const { chatId } = req.params;
        try {
            const messages = await this._chatUseCase.getChatMessage(chatId);
            res.status(200).json({ success: true, messages });
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ success: false, message: 'Error fetching messages' });
        }
    }
    ;
    async interactedUsers(req, res) {
        try {
            const userId = req.user.userId;
            const friendsList = await this._chatUseCase.friendsList(userId);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ friendsList });
        }
        catch (error) {
            logger_1.logger.error("Error in getting List of friendsChat", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async createGroup(req, res) {
        try {
            const adminId = req.user.userId;
            console.log(req.body);
            const { groupName, members } = req.body;
            if (!groupName || !members) {
                throw new customErrors_1.BadRequestError("All fields are required");
            }
            const createGroup = await this._chatUseCase.createGroupChat(adminId, groupName, members);
            res.status(httpEnums_1.HttpStatusCode.OK).json({ createGroup });
        }
        catch (error) {
            logger_1.logger.error("Error creating group chat", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
    async listGroup(req, res) {
        try {
            const userId = req.user.userId;
            const matchList = await this._chatUseCase.getGroups(userId);
            res.status(httpEnums_1.HttpStatusCode.CREATED).json(matchList);
        }
        catch (error) {
            logger_1.logger.error("Error creating group chat", error);
            res.status(httpEnums_1.HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
        }
    }
}
exports.ChatController = ChatController;
