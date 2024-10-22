import { UserController } from "../../providers/controllers/userController";
import { OTPVerificationRepository } from "../../providers/repositories/OTPRepository";
import { UserRepository } from "../../providers/repositories/userRepository";
import { UserUseCase } from "../../useCases/UserUseCase";
import { BcryptHashService } from "../services/hashService";
import { SMTPService } from "../services/smtpService";

const userRepository=new UserRepository()
const hashService = new  BcryptHashService()
const emailService = new SMTPService();
const otpRepository = new OTPVerificationRepository()




const userUseCases = new UserUseCase(userRepository, hashService, emailService, otpRepository);
const userController = new UserController(userUseCases)

export {  
    userController,
   

}