import { IAdmin } from "../entities/Admin";
import { HashService } from "../framework/services/hashService"; 
import { IAdminRepository } from "../interfaces/repositories/IAdminRepository"; 
import { IAdminUseCase } from "../interfaces/usecases/IAdminUseCase"; 
import { IUser } from "../entities/User"; 
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { logger } from "../framework/services/logger"; 
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongoose";
import { ITag } from "../entities/ITag"; 
import { BadRequestError } from "../framework/errors/customErrors"; 
import { IReport } from "../entities/IReport"; 
import { generateAccessToken, generateRefreshToken } from "../framework/services/jwtService";
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
        const adminRole=existingAdmin.role
        console.log(adminRole);
        
        const accessToken=generateAccessToken(existingAdmin._id .toString(),adminRole)
        const refreshToken=generateRefreshToken(existingAdmin._id .toString(),adminRole)

        return { user: existingAdmin, accessToken:accessToken,refreshToken:refreshToken }; 
    }
    
    async verifyToken(token: string): Promise<{ accessToken: string;}> {
        try {
            logger.info('Starting token verification');

            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { adminId: ObjectId };

            const admin= await this._adminRepository.findById(decoded.adminId);
            
            if (!admin || !admin._id) {
                logger.error('Admin not found or user ID is missing');
                throw new Error('Admin not found or user ID is missing');
            }
            const adminRole=admin.role
            const accessToken = generateAccessToken(admin._id.toString(),adminRole);
          

            logger.info('Token verification successful, returning new tokens');


            return {
                accessToken,
               
            }
        } catch (error) {
            
            if (error instanceof jwt.TokenExpiredError) {
                logger.error('Token has expired');
                throw new Error('Refresh token has expired');
            } else if (error instanceof jwt.JsonWebTokenError) {
                logger.error('Invalid token');
                throw new Error('Invalid refresh token');
            } else {
                logger.error('Error verifying token:', error);
                throw new Error('Token verification failed');
            }
        }
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
//-----------------Realated To Tags--------------------------------------------------------------------------------------------------------------//
    async createTag(tagData: Partial<ITag>): Promise<ITag> {
        const { name } = tagData;

       
        const existingTag = await this._adminRepository.findOne(name!);
        if (existingTag) {
            throw new BadRequestError ("Tag already exists");
        }

      
        return await this._adminRepository.create(tagData);
    }

    async getAllTags(): Promise<ITag[]> {
        return this._adminRepository.findAll()
    }


    async updateTags(tagData: Partial<ITag>): Promise<ITag> {
        const { _id, name } = tagData;

        if (!_id || !name) {
            throw new BadRequestError("Invalid  Tag Data");  
        }

        
        const updatedTag = await this._adminRepository.updateTagById(_id, { name });
        if(!updatedTag){
            throw new BadRequestError("failed to update the data")
        }

        return updatedTag;  
    }

    async deleteTag(tag_id: string): Promise<ITag> {
        if (!tag_id) {
            throw new BadRequestError("Invalid Tag ID");
        }
    
        const deletedTag = await this._adminRepository.deleteTagById(tag_id);
        
        if (!deletedTag) {
            throw new BadRequestError("Tag not found or already deleted");
        }
    
        return deletedTag;
    }

    //-------------------------------------------------------------------------------------------------------------------------------//
   async getAlReports(): Promise<IReport[]> {
    return this._adminRepository.findAllReportedBlog()
   }

}
