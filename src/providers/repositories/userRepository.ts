import { ISubscription } from "../../entities/ISubscription";
import { IUser } from "../../entities/User";
import Subscription from "../../framework/models/subscription";
import UserModel from "../../framework/models/user";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

export class UserRepository implements IUserRepository {
  
      async create(user: IUser): Promise<IUser> {
        const newUser = new UserModel(user);
        return newUser.save();
    }

    async findById(id: string): Promise<IUser | null> {
        return await UserModel.findById(id).lean().exec();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email }).lean().exec();
    }
    async delete(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id).lean().exec();
    }


    async markAsVerified(email: string): Promise<void> {
        await UserModel.findOneAndUpdate({ email: email }, { isVerified: true }, { new: true }).exec();
    }

   

    async userRole(id: string, role: 'client' | 'user'): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, { role }, { new: true }).lean().exec();
    }

    async updateUserDetails(id: string, userDetails: Partial<IUser>): Promise<IUser | null> {
    return await UserModel.findByIdAndUpdate(id, userDetails, { new: true }).lean().exec();
    
    }
    async addSubscription(userId: string, plan: string, status: string, amount: number, startDate: Date, endDate: Date, lastPaymentDate: Date, stripeId: string): Promise<ISubscription> {
        const newSubscription = await Subscription.create({
           userId,
            plan,
            status,
            amount,
            startDate,
            endDate,
            lastPaymentDate,
            stripeId
        })
         return newSubscription;
    }
    async findSubscriptionByUserId(userId: string): Promise< | null> {
    return Subscription.findOne({ userId, status: 'active' });
}
 }