

import { UserRepository } from '../../adaptors/repositories/UserRepository';
import { BcryptHashService } from '../services/hashService';
import { SMTPService } from '../services/smtpServices';
import { OTPVerificationRepository } from '../../adaptors/repositories/OTP-Repository';
import { UserUseCase } from '../../applications/useCases/UserUseCases';

import { UserController } from '../../adaptors/controllers/userController';
import { AdminController } from '../../adaptors/controllers/adminController';
import { AdminUseCase } from '../../applications/useCases/AdminUseCase';
import { AdminRepository } from '../../adaptors/repositories/AdminReposiory';
import { BlogRepositroy } from '../../adaptors/repositories/BlogRepository';
import { BlogPostUseCase } from '../../applications/useCases/BlogPostUseCases';
import { BlogController } from '../../adaptors/controllers/blogController';
import { s3 } from '../config/awsS3Config';

// user Details
const userRepository=new UserRepository()
const hashService = new  BcryptHashService()
const emailService = new SMTPService();
const otpRepository= new OTPVerificationRepository()

const userUseCases = new UserUseCase(userRepository, hashService, emailService, otpRepository);
const userController = new UserController(userUseCases)


// adminDeatils
const adminRepository= new AdminRepository();



const adminUseCase= new AdminUseCase(adminRepository,hashService ,userRepository);
const adminController = new AdminController(adminUseCase);

// BlogPost Details
const blogRepository = new BlogRepositroy();

const blogUseCase= new BlogPostUseCase(blogRepository,s3 );
const blogController = new BlogController(blogUseCase)

export {  
    userController,
    adminController,
    blogController

}