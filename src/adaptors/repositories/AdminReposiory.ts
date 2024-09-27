import { IAdmin } from "../../entities/Admin";
import { IUser } from "../../entities/User";
import AdminModel from "../../framework/database/models/admin";
import UserModel from "../../framework/database/models/user";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";


export class AdminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<IAdmin | null> {
        return await AdminModel.findOne({ email }).lean().exec() as IAdmin | null;
    }

    async saveAdmin(adminData: Partial<IAdmin>): Promise<IAdmin> {
        const existingAdmin = await AdminModel.findOne().lean().exec();
        if (existingAdmin) {
            throw new Error("An admin already exists.");
        }

        const newAdmin = new AdminModel(adminData);
        return await newAdmin.save() as IAdmin;
    }

    async getAllUsers(): Promise<IUser[]> {
        return await UserModel.find().lean().exec(); 
    }
    

}
