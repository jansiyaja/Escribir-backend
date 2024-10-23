import { ObjectId } from "mongoose";


export enum ReportStatus {
    PENDING = 'pending',
    ACCEPTED= 'accepted',
    REJECTRED='rejected'
   
  }
export interface IReport{
    blogPostId: string;
    authorId: ObjectId;
    reporterId: string;
    reason: string;
    reportedAt: Date;
    status: ReportStatus;
    createdAt: Date;
    updatedAt: Date;
  }