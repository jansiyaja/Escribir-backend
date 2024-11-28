import { ObjectId } from "mongoose";

export interface ISubscription extends Document {
  _id: ObjectId;
  userId:ObjectId; 
  plan: string; 
  status: 'active' | 'expired' | 'none' ; 
  startDate: Date; 
  stripeId:string
  endDate: Date;
  amount?: number; 
  lastPaymentDate?: Date; 
  createdAt: Date;
  updatedAt: Date;
}