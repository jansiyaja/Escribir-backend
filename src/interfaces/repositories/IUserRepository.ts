import { IUser } from "../../entities/User";
 


export interface IUserRepository{
   create(user: IUser): Promise<IUser>;
   findById(id:string):Promise<IUser|null>;
   findByEmail(email:string):Promise<IUser|null>;
   delete(id: string): Promise<void> 
   markAsVerified(id: string): Promise<void>;
   userRole(id: string, role: 'client' | 'user'): Promise<IUser | null>;
   updateUserDetails(id: string, userDetails: Partial<IUser>): Promise<IUser | null> 

}