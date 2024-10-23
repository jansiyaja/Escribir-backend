import { ObjectId } from "mongoose";

export interface INotification  {
    userId: ObjectId;       
    fromUserId: ObjectId;   
    message: string;     
    createdAt: Date;     
    isRead: boolean;   
        
}