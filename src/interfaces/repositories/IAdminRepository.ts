import { IAdmin } from "../../entities/Admin";
import { IUser } from "../../entities/User";
 


export interface IAdminRepository{
    findByEmail(email: string): Promise<IAdmin | null>;
    saveAdmin(adminData: Partial<IAdmin>): Promise<IAdmin>;
    getAllUsers(): Promise<IUser[]>;
}