import { Request,Response } from "express";
 
export interface IClientController {
  makePayment(req: Request, res: Response): Promise<void> 
  paymentSuccess(req: Request, res: Response): Promise<void>
  createAdd(req: Request, res: Response): Promise<void>
  listAdd(req: Request, res: Response): Promise<void>
}