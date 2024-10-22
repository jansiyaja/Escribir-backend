
import { IOTPVerificationRepository } from "../../interfaces/repositories/IOTPVerificationRepository";
import { IOTPVerification } from "../../entities/OTPVerification";
import OTPVerification from "../../framework/models/otp";

export  class OTPVerificationRepository implements  IOTPVerificationRepository{

    
    async create(data: Partial<IOTPVerification>): Promise<IOTPVerification> {
        return (await OTPVerification.create(data)).save()
    }

    async deleteByUserId(email: string): Promise<void> {
        await OTPVerification.findOneAndDelete({email}) 
    }


   async findByUserByEmail(email: string): Promise<IOTPVerification | null> {
   
    
        const result = await OTPVerification.findOne({ email});
          
         return result;

   }


   async updateOtp(email: string, newOtp: string): Promise<IOTPVerification | null> {
     
    const otpRecord = await OTPVerification.findOneAndUpdate(
        { email },
        { email,otp: newOtp },
        { new: true, upsert: true } 
    );
    console.log("otprec",otpRecord);
    
    if (otpRecord) {
        otpRecord.otp = newOtp;
       
        await otpRecord.save();  
        return otpRecord;
    } else {
        
        throw new Error(`No OTP found for email: ${email}`);
       
    }
   }
}



   
