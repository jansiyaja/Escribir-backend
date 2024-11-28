

import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../../entities/User';


const UserSchema: Schema = new Schema(
  {
    username: { type: String ,
           require:true
            },
    email: { type: String ,
             unique:true,
            require:true},
    password: { type: String,
                require:true
     },
    bio: { type: String,
      require:true
    },
    dob: { type: Date,
      require:true
     },
     
     role: { 
      type: String, 
      enum: ['client', 'user'],
      default: 'user' 
    },
    image: {
       type: String 
      },

    isActive: { 
      type: Boolean, 
      default: true },

    isVerified: {
      type: Boolean,
      default: false, 
    },
    isBlock: {
      type: Boolean,
      default: false, 
    },
    location: {
       type: String
       },
    linkedIn: {
       type: String
       },
    portfolio: {
       type: String 
      },
    github: { 
      type: String
    },
     isPremium: { type: Boolean, default: false }, 
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription', 
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
