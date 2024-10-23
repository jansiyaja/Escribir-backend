import mongoose, { Schema } from 'mongoose';
import { INotification } from '../../entities/INotification';



const NotificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
});

const NotificationModel = mongoose.model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
