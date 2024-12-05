import express, { Request, Response } from 'express';

import { authenticateToken } from '../framework/middleWares/tokenValidator';
import { clientController } from '../framework/utils/dependencyResolver';
import { uploadAdd } from '../framework/config/multerConfig';

export const clienRoute = express.Router();

clienRoute.post('/makePayment', authenticateToken, (req: Request, res: Response) => clientController.makePayment(req, res))
 clienRoute.post('/paymentUpdate', authenticateToken, (req: Request, res: Response) => clientController.paymentSuccess(req, res))
 clienRoute.post('/createAdd', authenticateToken,uploadAdd, (req: Request, res: Response) => clientController.createAdd(req, res))
 clienRoute.get('/listAdd', (req: Request, res: Response) => clientController.listAd(req, res))
 clienRoute.get('/listUserAdd', authenticateToken, (req: Request, res: Response) => clientController.listAdUser(req, res))
 clienRoute.post('/pauseAdd', authenticateToken, (req: Request, res: Response) => clientController.pauseAd(req, res))