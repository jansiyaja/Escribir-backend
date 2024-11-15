import { ObjectId } from "mongoose";
import { IUser } from "./User";

export interface IChat {
  _id:ObjectId| null
  Users: IUser[] | null;
  IsGroupChat: Boolean | null;
  ChatName: String | null;
  GroupAdmin: IUser | null;
  LatestMessage: ObjectId | null;
}