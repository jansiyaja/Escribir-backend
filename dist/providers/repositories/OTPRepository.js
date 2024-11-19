"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPVerificationRepository = void 0;
const otp_1 = __importDefault(require("../../framework/models/otp"));
class OTPVerificationRepository {
    async create(data) {
        return (await otp_1.default.create(data)).save();
    }
    async deleteByUserId(email) {
        await otp_1.default.findOneAndDelete({ email });
    }
    async findByUserByEmail(email) {
        const result = await otp_1.default.findOne({ email });
        return result;
    }
    async updateOtp(email, newOtp) {
        const otpRecord = await otp_1.default.findOneAndUpdate({ email }, { email, otp: newOtp }, { new: true, upsert: true });
        console.log("otprec", otpRecord);
        if (otpRecord) {
            otpRecord.otp = newOtp;
            await otpRecord.save();
            return otpRecord;
        }
        else {
            throw new Error(`No OTP found for email: ${email}`);
        }
    }
}
exports.OTPVerificationRepository = OTPVerificationRepository;
