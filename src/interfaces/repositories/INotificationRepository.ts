import { INotification } from "../../entities/INotification";

export interface INotificationRepository{
    sendNotification(userId: string, followerId: string, message: string): Promise<INotification>;
    getNotifications(userId: string): Promise<INotification[]>;
    markAsRead(notificationId: string): Promise<INotification[] | null>;
  deleteNotification(userId: string, followerId: string ,message: string): Promise<void>
}