

import express, { Request, Response } from 'express';
import { userController } from '../framework/utils/dependencyResolver';
import { authenticateRefreshToken, authenticateToken } from '../framework/middleware/tokenValidator';
import {  uploadProfileImage } from '../framework/config/multerConfig';

 export  const userRouter = express.Router();

    
    
 userRouter.post('/register', (req: Request, res: Response) => userController.register(req, res));
 userRouter.post('/verify-otp', (req: Request, res: Response) => userController.verifyOTP(req, res));
 
 userRouter.post('/login', (req: Request, res: Response) => userController.login(req, res));

 userRouter.post('/verify-token', authenticateRefreshToken, (req: Request, res: Response) => userController.verifyToken(req, res));

 userRouter.post('/resend-otp',(req: Request, res: Response) => userController.resendOTP(req, res))
 userRouter.post('/logout',(req: Request, res: Response)=>userController.logout(req,res))
 

 // after authentication
 userRouter.post('/profileImage',uploadProfileImage,authenticateToken,(req:Request,res:Response)=>userController.profileImageUpload(req,res));
 userRouter.post('/profile',authenticateToken,(req:Request,res:Response)=>userController.updateProfile(req,res));
 userRouter.get('/profile',authenticateToken,(req:Request,res:Response)=>userController.getProfile(req,res));

 
