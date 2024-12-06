import { ObjectId } from "mongoose";
import { IAdvertisement } from "../../entities/IAdvertisement";
import AdvertisementModel from "../../framework/models/advertisement";
import { IAdvertisementRepository } from "../../interfaces/repositories/IAdvertisementRepository";

export class AdvertisementRepository implements IAdvertisementRepository {
 
  async create(ad_Data: Partial<IAdvertisement>): Promise<IAdvertisement> {
        const advertisement = new AdvertisementModel(ad_Data);
        return await advertisement.save();
    }
   async findById(adId: string): Promise<IAdvertisement | null> {
             
         return AdvertisementModel.findById(adId).exec(); 
    }
    async findUserById(userId: ObjectId): Promise<IAdvertisement[]> {
       
        
        const ad = await AdvertisementModel.find({ userId: userId })  

        
        return ad
    }
   async findAllAds(): Promise<IAdvertisement[]> {
    return await AdvertisementModel.find({ status: "active" }).sort({ createdAt: -1 });
   }
    async findAllUserAds(userId: ObjectId): Promise<IAdvertisement[]> {
      return await AdvertisementModel.find({ userId: userId })  
    }
    async update(id: string, adData: Partial<IAdvertisement>): Promise<IAdvertisement | null> {
       const ad = await AdvertisementModel.findByIdAndUpdate(id, adData, { new: true });
        if (!ad) {
            throw new Error('Blog not found'); 
        }
        return ad;
    }

}