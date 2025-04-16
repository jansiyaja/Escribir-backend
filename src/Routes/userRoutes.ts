import express, { Request, Response } from 'express';
import { userController } from '../framework/utils/dependencyResolver'; 
import { authenticateRefreshToken, authenticateToken, checkRole } from '../framework/middleWares/tokenValidator';
import { uploadProfileImage } from '../framework/config/multerConfig';

export const userRouter = express.Router();



userRouter.post('/register',  (req: Request, res: Response) => userController.register(req,res));
userRouter.post('/verify-otp', (req: Request, res: Response) => userController.verifyOTP(req, res));
userRouter.post('/verify-token' ,authenticateRefreshToken,(req: Request, res: Response) => userController.verifyToken(req, res));
userRouter.post('/login', (req: Request, res: Response) => userController.login(req, res));
userRouter.post('/resend-otp',(req: Request, res: Response) => userController.resendOTP(req, res))
userRouter.post('/logout',(req: Request, res: Response)=>userController.logout(req,res))
 
 //-- after authentication------------------------------------------------------------------------------------------//
 userRouter.post('/profileImage',uploadProfileImage,authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>userController.profileImageUpload(req,res));
 userRouter.post('/profile',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>userController.updateProfile(req,res));
 userRouter.get('/profile',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>userController.getProfile(req,res));
 userRouter.post('/feedback', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => userController.feedback(req, res));
userRouter.get('/connectionProfile/:autherId/', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => userController.friendprofile(req, res));
 userRouter.post('/makePayment',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.makePayment(req,res))
userRouter.post('/paymentUpdate', authenticateToken, checkRole(['user', 'client']),(req: Request, res: Response) => userController.paymentSuccess(req, res))
 userRouter.get('/user-subscription',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.user_subscription(req, res))
 userRouter.post('/update-password',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.updatePassword(req, res))
 userRouter.get('/2fa_generate',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.generateqr(req, res))
 userRouter.post('/verify_2fa',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.verify2FA(req, res))
 userRouter.post('/disable_2fa',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.disable2FA(req, res))
 userRouter.post('/sendverificationEmail',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.sendingEmail(req, res))
 userRouter.post('/verification',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.verifyingOtp(req, res))
 userRouter.post('/account_delete',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => userController.accountDelete(req, res))
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
userRouter.get('/notifications', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => userController.getAllNotifications(req, res));
userRouter.post('/notificationSend', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => userController.sendNotifications(req, res));




