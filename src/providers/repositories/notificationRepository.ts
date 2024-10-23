import { INotification } from "../../entities/INotification";
import NotificationModel from "../../framework/models/notification";
import { INotificationRepository } from "../../interfaces/repositories/INotificationRepository";


export default class NotificationRepository implements INotificationRepository {
    async sendNotification(userId: string, followerId: string, message: string): Promise<INotification>  {
        const notification = new NotificationModel({
            userId,
            fromUserId: followerId,
            message,
            createdAt: new Date(),
            isRead: false, 
        });

       return  await notification.save();
    }
    async getNotifications(userId: string): Promise<INotification[]> {
        return await NotificationModel.find({ userId})
        .populate("fromUserId", "username image")
        .sort({ createdAt: -1 }); 
    }

    async markAsRead(notificationId: string): Promise<INotification[] | null> {
        return await NotificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    }
   async deleteNotification(userId: string, followerId: string, message:string): Promise<void> {
   
    await NotificationModel.findOneAndDelete({
        userId :followerId,         
        fromUserId: userId,  
        message:message
       
    }).lean().exec();
}

}

