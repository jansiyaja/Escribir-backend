import { ObjectId } from "mongoose";

export interface IMessage {
 _id:string
    Sender_id: ObjectId | null;
    content: string;
  Chat: ObjectId | null;
  ReadBy: ObjectId | null;
}
