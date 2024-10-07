import { ObjectId } from "mongoose";


export interface IBlogPost  {
    author_id:ObjectId
    heading: string;
    tag: string;
    content: object; 
    coverImageUrl: string; 
    createdAt: Date;
    updatedAt: Date;
}


