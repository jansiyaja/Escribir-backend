import { ISubscription } from "../../entities/ISubscription";
import { IUser } from "../../entities/User";
 


export interface IUserRepository{
   create(user: IUser): Promise<IUser>;
   findById(id:string):Promise<IUser|null>;
   findByEmail(email:string):Promise<IUser|null>;
   delete(id: string): Promise<void> 
   markAsVerified(id: string): Promise<void>;
   userRole(id: string, role: 'client' | 'user'): Promise<IUser | null>;
   updateUserDetails(id: string, userDetails: Partial<IUser>): Promise<IUser | null> 
   addSubscription(userId: string, plan: string, status: string, amount: number, startDate: Date, endDate: Date, lastPaymentDate: Date, stripeId: string): Promise<ISubscription>
   findSubscriptionByUserId(userId: string): Promise<ISubscription | null> 

}