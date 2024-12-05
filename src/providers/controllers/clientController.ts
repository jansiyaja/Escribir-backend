import { Request, Response } from "express";
import { IClientController } from "../../interfaces/controllers/IClientController";
import { IClientUseCase } from "../../interfaces/usecases/IClientUseCase";
import { BadRequestError, UnauthorizedError } from "../../framework/errors/customErrors";
import { HttpStatusCode } from "./httpEnums";
import { logger } from "../../framework/services/logger";

export class ClientController implements IClientController {
    constructor(private _clientUseCase: IClientUseCase) { }

  async makePayment(req: Request, res: Response): Promise<void> {
    try {
      const {  email ,businessName} = req.body;
      const userId = (req as any).user.userId;

      if (!email || !userId || !businessName) {
        throw new BadRequestError("Plan and User ID are required.");
      }

      const sessionId = await this._clientUseCase.makePayment( userId, email,businessName);

      res.status(HttpStatusCode.CREATED).json(sessionId);
    } catch (error) {
      logger.error("Error ", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });
    }

    }

 async paymentSuccess(req: Request, res: Response): Promise<void> {
    console.log("iam here payment sucess page");


    try {

      const { amount, orderId, customerEmail,businessName } = req.body
    console.log(req.body);
    

      const userId = (req as any).user.userId;
      const paymentSuccess = await this._clientUseCase.upadateData( userId, orderId, amount, customerEmail,businessName);

      res.status(HttpStatusCode.CREATED).json(paymentSuccess);
    } catch (error) {
      logger.error("Error in paymentSuccess:", error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error });

    }
    }
    
async createAdd(req: Request, res: Response): Promise<void> {
    const { textContent } = req.body;
    const imageBuffer = req.file?.mimetype?.startsWith('image/') ? req.file?.buffer : null; 
    const videoBuffer = req.file?.mimetype?.startsWith('video/') ? req.file?.buffer : null;  
    const videoMimeType = req.file?.mimetype;
    const userId = (req as any).user.userId;
  console.log(textContent, imageBuffer, videoBuffer, videoMimeType);
    
   if (!textContent && !imageBuffer && !videoBuffer) {
    logger.warn('At least one of text content, image, or video must be uploaded.');
    res.status(400).send('At least one of text content, image, or video must be uploaded.');
    return;
}

    try {
        let mediaKey = ''; 

  
        if (req.body.format === 'Image Ad' && imageBuffer) {
            logger.info('Uploading image to S3');
            mediaKey = await this._clientUseCase.uploadImageToS3(imageBuffer, userId);
        }

    
        if (req.body.format === 'Video Ad' && videoBuffer) {
            logger.info('Uploading video to S3');
            mediaKey = await this._clientUseCase.uploadVideoToS3(videoBuffer, videoMimeType!);  // Pass the mimetype for video upload
        }

      
        const ad = await this._clientUseCase.createAdvertisement(req.body, mediaKey, userId);
        res.status(HttpStatusCode.CREATED).json(ad);

    } catch (error) {
        logger.error('Error creating advertisement:', error);
        res.status(500).send('Error creating advertisement');
    }
    }
    async listAd(req: Request, res: Response): Promise<void> {
        const userId = (req as any).user.userId;

        try {

      const list_ad = await this._clientUseCase.listAdd(userId);
       res.status(HttpStatusCode.CREATED).json(list_ad);    
            
        } catch (error) {
          logger.error('Error listing advertisement:', error);
        res.status(500).send('Error listing advertisement');   
        }

    }
        async listAdUser(req: Request, res: Response): Promise<void> {
            
        const userId = (req as any).user.userId;
         if ( !userId ) {
        throw new UnauthorizedError("Plan and User ID are required.");
        }
        try {

      const list_ad = await this._clientUseCase.listAdUser(userId);
       res.status(HttpStatusCode.CREATED).json(list_ad);    
            
        } catch (error) {
          logger.error('Error listing advertisement:', error);
        res.status(500).send('Error listing advertisement');   
        }

    }
    async pauseAd(req: Request, res: Response): Promise<void> {
         const userId = (req as any).user.userId;
         if ( !userId ) {
        throw new UnauthorizedError("Plan and User ID are required.");
        }
        try {
            const { adId } = req.body

        const pauseAd = await this._clientUseCase.pauseAd(adId,userId);
       res.status(HttpStatusCode.CREATED).json(pauseAd);    
            
            
        } catch (error) {
            logger.error('Error listing advertisement:', error);
        res.status(500).send('Error listing advertisement');   
         
        }
       
        
    }

}