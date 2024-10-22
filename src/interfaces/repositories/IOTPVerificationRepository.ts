import { IOTPVerification } from "../../entities/OTPVerification";



export interface IOTPVerificationRepository{
    findByUserByEmail(email:string):Promise<IOTPVerification|null>;
    deleteByUserId(w:string):Promise<void>;
    create(data:Partial<IOTPVerification>):Promise<IOTPVerification>
    updateOtp(email: string, newOtp: string): Promise<IOTPVerification | null>;
}