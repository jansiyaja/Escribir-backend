

import express, { Request, Response } from 'express';
import { authenticateToken, checkRole } from '../framework/middleWares/tokenValidator';
import { commentController } from '../framework/utils/dependencyResolver';


export const commentRoute = express.Router();

commentRoute.post('/addComment/:id/', authenticateToken, checkRole(['user', 'client']), (req: Request, res: Response) => commentController.addComment(req, res));
commentRoute.post('/reactComment/:commentId/', authenticateToken, checkRole(['user', 'client']), (req: Request, res: Response) => commentController.reactToComment(req, res));
commentRoute.post('/replyComment/:commentId/', authenticateToken, checkRole(['user', 'client']), (req: Request, res: Response) => commentController.replyToComment(req, res));