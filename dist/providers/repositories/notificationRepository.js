"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_1 = __importDefault(require("../../framework/models/notification"));
class NotificationRepository {
    async sendNotification(userId, followerId, message) {
        const notification = new notification_1.default({
            userId,
            fromUserId: followerId,
            message,
            createdAt: new Date(),
            isRead: false,
        });
        return await notification.save();
    }
    async getNotifications(userId) {
        return await notification_1.default.find({ userId })
            .populate("fromUserId", "username image")
            .sort({ createdAt: -1 });
    }
    async markAsRead(notificationId) {
        return await notification_1.default.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    }
    async deleteNotification(userId, followerId, message) {
        await notification_1.default.findOneAndDelete({
            userId: followerId,
            fromUserId: userId,
            message: message
        }).lean().exec();
    }
}
exports.default = NotificationRepository;
