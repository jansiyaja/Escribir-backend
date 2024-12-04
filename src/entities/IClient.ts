import { ObjectId } from "mongoose";

export interface IClient{
     _id?: ObjectId;
  userId: ObjectId; 
  paymentId: string; 
 paymentAmount: string; 
 businessName:string
 maxAds?: number; 
 activeAds?: number; 
 advertisements?:string
     
}
