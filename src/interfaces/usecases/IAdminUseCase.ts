import { IAdmin } from "../../entities/Admin";
import { IUser } from "../../entities/User";

 export interface IAdminUseCase{
    
    loginAdmin(adminData: Partial<IAdmin>): Promise<{  user: IAdmin ; accessToken: string; refreshToken: string }>
    getAllUsers(): Promise<IUser[]> 
   
 }