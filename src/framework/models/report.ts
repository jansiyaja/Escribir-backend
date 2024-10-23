import mongoose, { Schema } from 'mongoose';
import { IReport, ReportStatus } from '../../entities/IReport';

const ReportSchema: Schema = new Schema({
  blogPostId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true 
  },
  authorId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  reason: { 
    type: String,
    required: true
  },
  reportedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: Object.values(ReportStatus),
    default: ReportStatus.PENDING, 
  }
}, { timestamps: true });

const Report = mongoose.model<IReport>('Report', ReportSchema);
export default Report;
