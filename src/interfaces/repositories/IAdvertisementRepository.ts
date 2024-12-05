import { ObjectId } from "mongoose";
import { IAdvertisement } from "../../entities/IAdvertisement";

export interface IAdvertisementRepository {
    create(ad: IAdvertisement): Promise<IAdvertisement>;
   findById(adId: string): Promise<IAdvertisement | null>
    findUserById(userId: ObjectId): Promise<IAdvertisement[]> 
     findAllAds(): Promise<IAdvertisement[]> 
    findAllUserAds(userId: ObjectId): Promise<IAdvertisement[]> 
     update(id: string, adData: Partial<IAdvertisement>): Promise<IAdvertisement | null>   ;

}