import mongoose, { Schema } from 'mongoose';
import { ISubscription } from '../../entities/ISubscription';




const SubscriptionSchema: Schema = new Schema<ISubscription>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
  
    plan: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'none'],
      required: true,
      default: "none",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    lastPaymentDate: {
      type: Date,
    },
    stripeId: {
      type:String
    }
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
