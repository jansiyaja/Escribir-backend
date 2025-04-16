import { IAdvertisement } from "../../entities/IAdvertisement";

export interface IClientUseCase { 
     makePayment(userId: string, email: string, businessName:string): Promise<string>
     upadateData(userId: string, orderId: string, amount: string, email: string, businessName: string): Promise<string>
     uploadImageToS3(buffer: Buffer, userId: string): Promise<string>;
     uploadVideoToS3(buffer: Buffer|null, mimeType: string|undefined): Promise<string> 
     createAdvertisement(adDetails: IAdvertisement, imageBuffer: string, userId: string): Promise<IAdvertisement>
     listAdd(): Promise<IAdvertisement[]> 
     listAdUser(userId: string): Promise<IAdvertisement[]> 
     pauseAd(adId: string,userId: string): Promise<IAdvertisement|null> 
     

}