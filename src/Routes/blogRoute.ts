import express, { Request, Response } from 'express';
import { blogController } from '../framework/utils/dependencyResolver';
import { uploadBlogData, uploadBlogImage } from '../framework/config/multerConfig';
import { authenticateToken } from '../framework/middleware/tokenValidator';

export  const blogRouter = express.Router();

blogRouter.post('/blogeditor',uploadBlogData,authenticateToken,(req:Request,res:Response)=>blogController.createBlogPost(req,res));
blogRouter.post('/blogimage',uploadBlogImage,authenticateToken,(req:Request,res:Response)=>blogController.blogEditorImage(req,res));
blogRouter.get('/',authenticateToken,(req: Request, res: Response) => blogController.listBlogs(req, res))
blogRouter.get('/tags',authenticateToken,(req: Request, res: Response) => blogController.listTags(req, res))
blogRouter.get('/singleblog/:id', authenticateToken, (req: Request, res: Response) => blogController.singleBlog(req, res));
blogRouter.get('/getblog/:id', authenticateToken, (req: Request, res: Response) => blogController.singleBlogEdit(req, res));
blogRouter.delete('/delete-tag/:id', authenticateToken, (req: Request, res: Response) => blogController.deletePost(req, res));
blogRouter.put('/blogeditor/:id', authenticateToken, (req: Request, res: Response) => blogController.updatePost(req, res));


blogRouter.get('/your-blog/:userId/', authenticateToken, (req: Request, res: Response) => blogController.userBlog(req, res));




