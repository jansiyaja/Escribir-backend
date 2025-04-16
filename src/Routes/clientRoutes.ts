import express, { Request, Response } from 'express';

import { authenticateToken, checkRole } from '../framework/middleWares/tokenValidator';
import { clientController } from '../framework/utils/dependencyResolver';
import { uploadAdd } from '../framework/config/multerConfig';

export const clienRoute = express.Router();

clienRoute.post('/makePayment', authenticateToken, checkRole(['client']),(req: Request, res: Response) => clientController.makePayment(req, res))
 clienRoute.post('/paymentUpdate', authenticateToken,checkRole(['client']), (req: Request, res: Response) => clientController.paymentSuccess(req, res))
 clienRoute.post('/createAdd', authenticateToken,uploadAdd, checkRole(['client']),(req: Request, res: Response) => clientController.createAdd(req, res))
 clienRoute.get('/listAdd', (req: Request, res: Response) => clientController.listAd(req, res))
 clienRoute.get('/listUserAdd', authenticateToken,checkRole(['client']), (req: Request, res: Response) => clientController.listAdUser(req, res))
 clienRoute.post('/pauseAdd', authenticateToken,checkRole(['client']), (req: Request, res: Response) => clientController.pauseAd(req, res))