import { AdminController } from "../../providers/controllers/adminController";
import { BlogController } from "../../providers/controllers/blogController";
import { ChatController } from "../../providers/controllers/chatController";
import { SocialController } from "../../providers/controllers/socialController";
import { UserController } from "../../providers/controllers/userController";
import { AdminRepository } from "../../providers/repositories/adminRepository";
import { BlogRepositroy } from "../../providers/repositories/blogRepository";
import { ChatRepository } from "../../providers/repositories/chatRepository";
import { CommentRepository } from "../../providers/repositories/commentRepository";
import FollowRepository from "../../providers/repositories/followRepository";
import { MessageRepository } from "../../providers/repositories/messageRepository";
import NotificationRepository from "../../providers/repositories/notificationRepository";
import { OTPVerificationRepository } from "../../providers/repositories/OTPRepository";
import ReactionRepository from "../../providers/repositories/reactionRepository";
import { UserRepository } from "../../providers/repositories/userRepository";
import { AdminUseCase } from "../../useCases/AdminUseCase";
import { BlogPostUseCase } from "../../useCases/BlogUseCase";
import { ChatUseCase } from "../../useCases/ChatUseCase";
import { SocialUseCase } from "../../useCases/SocialUseCase";
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
const chatRepository =new ChatRepository()
const messageRepository =new MessageRepository()


const userUseCases = new UserUseCase(userRepository, hashService, emailService, otpRepository,notificationRepository);
const userController = new UserController(userUseCases)


const socialUseCase = new SocialUseCase(userRepository, notificationRepository, followerRepository)
const socialController= new SocialController(socialUseCase)

const chatUseCase = new ChatUseCase(userRepository, chatRepository, messageRepository)
const chatController = new ChatController(chatUseCase)

const adminUseCase= new AdminUseCase(adminRepository,hashService ,userRepository);
const adminController = new AdminController(adminUseCase);

const blogUseCase= new BlogPostUseCase(blogRepository,s3,reactionReopository ,notificationRepository,commentRepository);
const blogController = new BlogController(blogUseCase)

export {  
    userController,
    adminController,
    blogController,
    socialController,
    chatController
   

}