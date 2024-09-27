import express,{Request,Response} from 'express'
import { adminController } from '../framework/utils/dependencyResolver';

export  const adminRouter = express.Router();



  
adminRouter.post('/login', (req: Request, res: Response) => adminController.login(req, res));
adminRouter.get('/users',(req: Request, res: Response) => adminController.listUsers(req, res))