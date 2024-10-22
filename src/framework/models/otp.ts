import mongoose ,{ Schema, } from "mongoose";
import { IOTPVerification } from "../../entities/OTPVerification";

const OTPVerificationSchema:Schema<IOTPVerification>=new Schema({
    otp:{
        type:String,
        required:true
    },
   email:{
    type:String,

   }
},{
        timestamps:true
    
});
OTPVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 });
const OTPVerification = mongoose.model<IOTPVerification>('OTPVerification', OTPVerificationSchema);
export default OTPVerification;
