import { ObjectId } from "mongoose";
import { IAdvertisement } from "../../entities/IAdvertisement";

export interface IAdvertisementRepository {
    create(ad: IAdvertisement): Promise<IAdvertisement>;
    findById(userId: ObjectId): Promise<IAdvertisement | null> 
     findAllAds(): Promise<IAdvertisement[]> 

}