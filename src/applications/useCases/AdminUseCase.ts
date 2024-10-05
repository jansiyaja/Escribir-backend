import { IAdmin } from "../../entities/Admin";
import { HashService } from "../../framework/services/hashService";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository";
import { IAdminUseCase } from "../../interfaces/usecases/IAdminUseCase";
import { generateAccessToken } from "../../framework/services/jwtServices";
import { IUser } from "../../entities/User";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";

export class AdminUseCase implements IAdminUseCase {
    constructor(
        private _adminRepository: IAdminRepository,
        private _hashService: HashService,
        private _userRepository:IUserRepository
    ) {}

    async loginAdmin(adminData: Partial<IAdmin>): Promise<{ user: IAdmin ;  accessToken: string; refreshToken: string }> {
        if (!adminData.email) {
            throw new Error("Email is required");
        }

        if (!adminData.password) {
            throw new Error("Password is required");
        }

        const existingAdmin = await this._adminRepository.findByEmail(adminData.email);
        if (!existingAdmin) {
            throw new Error("No admin found with this email.");
        }

        const isMatch = await this._hashService.compare(adminData.password, existingAdmin.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }
        const accessToken=generateAccessToken(existingAdmin._id .toString())
        const refreshToken=generateAccessToken(existingAdmin._id .toString())

        return { user: existingAdmin, accessToken:accessToken,refreshToken:refreshToken }; 
    }

    async getAllUsers(): Promise<IUser[]> {
   
        return await this._adminRepository.getAllUsers();
    }


    async blockUser(userId: string): Promise<IUser | null> {
     
        const user = await this._userRepository.findById(userId);

        if (!user) {
            return null; 
        }

     
        const updatedUser = await this._userRepository.updateUserDetails(userId, { isBlock: true });

        return updatedUser; 
    }
    async unblockUser(userId: string): Promise<IUser | null> {
        const user = await this._userRepository.findById(userId);
    
        if (!user) {
            return null;
        }
    
        const updatedUser = await this._userRepository.updateUserDetails(userId, { isBlock: false });
        return updatedUser; 
    }
    
     
}
