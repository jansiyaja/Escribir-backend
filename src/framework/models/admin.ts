
import mongoose, { Schema, Model } from 'mongoose';
import { IAdmin } from '../../entities/Admin'; 

const AdminSchema: Schema = new Schema({
  email: { type: String },
  password: { type: String },
  isVerified: {
    type: Boolean,
    default: false, 
  },
  role:{
    type:String,
    default:"admin"

  }
},
{
    timestamps: true, 
  }
);

const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default AdminModel;

