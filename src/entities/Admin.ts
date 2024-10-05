 import { ObjectId } from "mongoose";


export interface IAdmin  {
    _id: ObjectId;
    email: string;
    password: string;
    role:string;

  }