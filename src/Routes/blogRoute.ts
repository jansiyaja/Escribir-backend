import express, { Request, Response } from 'express';
import { blogController } from '../framework/utils/dependencyResolver';
import { uploadBlogData, uploadBlogImage } from '../framework/config/multerConfig';
import { authenticateToken } from '../framework/middleware/tokenValidator';

export  const blogRouter = express.Router();

blogRouter.post('/blogeditor',uploadBlogData,authenticateToken,(req:Request,res:Response)=>blogController.createBlogPost(req,res));
blogRouter.post('/blogimage',uploadBlogImage,authenticateToken,(req:Request,res:Response)=>blogController.blogEditorImage(req,res));
blogRouter.get('/',(req: Request, res: Response) => blogController.listBlogs(req, res))

