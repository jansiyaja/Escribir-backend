"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const messages_1 = __importDefault(require("../../framework/models/messages"));
class MessageRepository {
    async createMessage(senderId, chatId, content) {
        const newMessage = new messages_1.default({
            Sender_id: senderId,
            Chat: chatId,
            Content: content
        });
        return await newMessage.save();
    }
    async getMessagesForChat(chatId) {
        const messages = await messages_1.default.find({ Chat: chatId }).populate('Sender_id').populate('Chat').sort({ createdAt: 1 });
        return messages;
    }
}
exports.MessageRepository = MessageRepository;
