import mongoose, { Schema, Document } from 'mongoose';
export enum FollowStatus {
    PENDING = 'pending',
    FULLFILLED = 'fullfilled',
  }

 export interface IFollow extends Document {
  follower: mongoose.Schema.Types.ObjectId;
  following: mongoose.Schema.Types.ObjectId; 
  status:FollowStatus;
}

const FollowSchema: Schema<IFollow> = new Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    status: {
        type: String,
        enum: Object.values(FollowStatus),
        default: FollowStatus.PENDING, 
      },
  },
  {
    timestamps: true, 
  }
);

const FollowModel = mongoose.model<IFollow>('Follow', FollowSchema);

export default FollowModel;
