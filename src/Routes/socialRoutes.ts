import express, { Request, Response } from 'express';
import { authenticateToken, checkRole } from '../framework/middleWares/tokenValidator';
import { socialController } from '../framework/utils/dependencyResolver';

export const socialRoute = express.Router();

socialRoute.get('/followStatus/:followingId/', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => socialController.followStatus(req, res));
socialRoute.post('/follow/:followingId/', authenticateToken, checkRole(['user', 'client']),(req: Request, res: Response) => socialController.followUser(req, res));
socialRoute.post('/unfollow/:followingId/', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => socialController.unfollowUser(req, res));
socialRoute.post('/followAccept/:followingId/', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => socialController.followAccept(req, res));
socialRoute.get('/getFollowers', authenticateToken,checkRole(['user', 'client']), (req: Request, res: Response) => socialController.getFollowers(req, res));
socialRoute.get('/follows/search',authenticateToken,checkRole(['user', 'client']),(req:Request,res:Response)=>socialController.searchUser(req,res))