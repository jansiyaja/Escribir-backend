import { ObjectId } from "mongoose";

export interface ITag{
    _id:string;
    name:string;
    createdAt: Date 
    updatedAt: Date 
}