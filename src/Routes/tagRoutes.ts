import express, { Request, Response } from 'express';
import { authenticateToken, checkRole } from '../framework/middleWares/tokenValidator';
import { tagController } from '../framework/utils/dependencyResolver';

export const tagRoute = express.Router();

tagRoute.get('/tags',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => tagController.listTags(req, res))
tagRoute.get('/trendtags',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => tagController.trendTags(req, res))
tagRoute.get('/tagBlog/:tag',authenticateToken,checkRole(['user', 'client']),(req: Request, res: Response) => tagController.TagByBlogs(req, res))