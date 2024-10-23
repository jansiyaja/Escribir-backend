import { ObjectId } from "mongoose";

export enum BlogStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
  }

export interface IBlogPost  {
    _id: string
    author_id:ObjectId
    heading: string;
    tag: string;
    content: object; 
    coverImageUrl: string; 
    createdAt: Date;
    updatedAt: Date;
    status: BlogStatus;
    reactions: ObjectId[];
    comments: ObjectId[];
}


