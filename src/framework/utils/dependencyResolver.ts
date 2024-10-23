import { AdminController } from "../../providers/controllers/adminController";
import { BlogController } from "../../providers/controllers/blogController";
import { UserController } from "../../providers/controllers/userController";
import { AdminRepository } from "../../providers/repositories/adminRepository";
import { BlogRepositroy } from "../../providers/repositories/blogRepository";
import { CommentRepository } from "../../providers/repositories/commentRepository";
import FollowRepository from "../../providers/repositories/followRepository";
import NotificationRepository from "../../providers/repositories/notificationRepository";
import { OTPVerificationRepository } from "../../providers/repositories/OTPRepository";
import ReactionRepository from "../../providers/repositories/reactionRepository";
import { UserRepository } from "../../providers/repositories/userRepository";
import { AdminUseCase } from "../../useCases/AdminUseCase";
import { BlogPostUseCase } from "../../useCases/BlogUseCase";
import { UserUseCase } from "../../useCases/UserUseCase";
import { s3 } from "../config/awsConfig";
import { BcryptHashService } from "../services/hashService";
import { SMTPService } from "../services/smtpService";

const userRepository=new UserRepository()
const hashService = new  BcryptHashService()
const emailService = new SMTPService();
const otpRepository = new OTPVerificationRepository()
const adminRepository = new AdminRepository()
const blogRepository =new BlogRepositroy()
const reactionReopository = new ReactionRepository() 
const notificationRepository = new  NotificationRepository()
const followerRepository = new FollowRepository()
const commentRepository = new CommentRepository()


const userUseCases = new UserUseCase(userRepository, hashService, emailService, otpRepository,followerRepository,notificationRepository);
const userController = new UserController(userUseCases)


const adminUseCase= new AdminUseCase(adminRepository,hashService ,userRepository);
const adminController = new AdminController(adminUseCase);

const blogUseCase= new BlogPostUseCase(blogRepository,s3,reactionReopository ,notificationRepository,commentRepository);
const blogController = new BlogController(blogUseCase)

export {  
    userController,
    adminController,
    blogController
   

}