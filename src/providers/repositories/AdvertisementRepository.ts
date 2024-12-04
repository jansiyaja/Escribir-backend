import { ObjectId } from "mongoose";
import { IAdvertisement } from "../../entities/IAdvertisement";
import AdvertisementModel from "../../framework/models/advertisement";
import { IAdvertisementRepository } from "../../interfaces/repositories/IAdvertisementRepository";

export class AdvertisementRepository implements IAdvertisementRepository {
 
  async create(ad_Data: Partial<IAdvertisement>): Promise<IAdvertisement> {
        const advertisement = new AdvertisementModel(ad_Data);
        return await advertisement.save();
    }
    async findById(userId: ObjectId): Promise<IAdvertisement | null> {
        const ad = await AdvertisementModel.findById(userId).exec()
        return ad
    }
     async findAllAds(): Promise<IAdvertisement[]> {
        return await AdvertisementModel.find().sort({ createdAt: -1 }); 
    }

}