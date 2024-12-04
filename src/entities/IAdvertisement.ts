import { ObjectId } from "mongoose";

export enum  AdContent {
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text'
}

export interface IAdContent {
    type: AdContent;
    value: string;
}

export interface IAdvertisement {
    _id?: string;
  userId: ObjectId; 
  title: string; 
  targetAudience: string; 
  industry: string;  
    format: "Video Ad" | "Image Ad" | "Text Ad";
    link: string;
  contents: IAdContent[]; 
  status: "active" | "inactive"; 
}