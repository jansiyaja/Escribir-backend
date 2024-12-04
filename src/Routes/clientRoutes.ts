import express, { Request, Response } from 'express';

import { authenticateToken } from '../framework/middleWares/tokenValidator';
import { clientController } from '../framework/utils/dependencyResolver';
import { uploadAdd } from '../framework/config/multerConfig';

export const clienRoute = express.Router();

clienRoute.post('/makePayment', authenticateToken, (req: Request, res: Response) => clientController.makePayment(req, res))
 clienRoute.post('/paymentUpdate', authenticateToken, (req: Request, res: Response) => clientController.paymentSuccess(req, res))
 clienRoute.post('/createAdd', authenticateToken,uploadAdd, (req: Request, res: Response) => clientController.createAdd(req, res))
 clienRoute.get('/listAdd', authenticateToken, (req: Request, res: Response) => clientController.listAdd(req, res))