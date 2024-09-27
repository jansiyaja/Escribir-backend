import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUser } from "../../entities/User";
import { HashService } from "../../framework/services/hashService";
import { IEmailService } from "../../interfaces/repositories/IEmailRepository";
import crypto from 'crypto';
import { IOTPVerificationRepository } from "../../interfaces/repositories/IOTPVerificationRepository";
import { generateAccessToken,generateRefreshToken } from "../../framework/services/jwtServices";
import jwt from 'jsonwebtoken';
import { IUserUseCase } from "../../interfaces/usecases/IUserUseCase";
import { logger } from "../../framework/services/logger";
import { BadRequestError, InvalidTokenError,InternalServerError } from "../../framework/errors/customErrors";
import { cloudinary } from "../../framework/config/cloudinaryConfig";

export class UserUseCase  implements IUserUseCase{
    constructor(
        private _userRepository: IUserRepository,
        private _hashService: HashService,
        private _emailServices: IEmailService,
        private _otpRepository: IOTPVerificationRepository
    ) {}

    async registerUser(userData: Partial<IUser>):Promise<{ user: IUser;  }> {
        
        logger.info('checking existing user')

        const existingUser = await this._userRepository.findByEmail(userData.email!);
        
        
        if (existingUser) {
           throw new  BadRequestError("User with email already exists")
            
        }
        
        const hashedPassword = await this._hashService.hash(userData.password!);
        const otp = crypto.randomInt(1000, 9999).toString();
        console.log(otp);
        

        const newUser: IUser = {
            ...userData,          
            password: hashedPassword, 
            isVerified: false    
        } as IUser;

        const createUser = await this._userRepository.create(newUser);
       

        if (!createUser.email) {
            throw new Error("Failed to create user: Email is null");
        }

        const newOtp = { otp: otp, email: createUser.email };
        await this._otpRepository.create(newOtp);

        await this._emailServices.sendEmail({
            to: userData.email!,
            subject: "Welcome To Escriber, Our Blog Platform!",
            text: `Hi ${userData.username}, welcome to our platform! We're excited to have you here.Your Otp Is ${otp}`
        });

        return {
            user:createUser
        }
           
           
    
    }
    
    async verifyOTP({ otp, email }: { otp: string; email: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        logger.info('Verifying OTP for email', { email });

        const otpVerification = await this._otpRepository.findByUserByEmail(email);
        if (!otpVerification) {
            throw new BadRequestError('No OTP record found for this email');
        }
       
       
       const otpCreatedAt = otpVerification.createdAt;
       if (!otpCreatedAt) {
           throw new InternalServerError('OTP creation time is missing');
       }

      
        const currentTime = new Date();
        const hourDifference = (currentTime.getTime() - otpCreatedAt.getTime()) / (1000 * 60 * 60);
        if (hourDifference > 1) {
            await this._userRepository.delete(email);
            throw new BadRequestError('OTP expired and user deleted');
        }

        if (otpVerification.otp !== otp) {
            throw new BadRequestError('Invalid OTP provided');
        }

        await this._userRepository.markAsVerified(email);
        await this._otpRepository.deleteByUserId(email);

        const user = await this._userRepository.findByEmail(email);
        if (!user) {
            throw new InternalServerError('User not found');
        }

        const accessToken = generateAccessToken(user._id!);
        const refreshToken = generateRefreshToken(user._id!);

        return { user, accessToken, refreshToken };
    }

    async loginUser(userData: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
        const existingUser = await this._userRepository.findByEmail(userData.email!);
        if (!existingUser) {
            throw new Error("User with email not exists");
        }
        
        const isMatch = await this._hashService.compare(userData.password!, existingUser.password!);

        if (!isMatch) {
            throw new Error("Invalid password");
        }
           
        const userId = existingUser._id;
        if (!userId) {
          throw new Error("User ID is missing");
        }
          const accessToken = generateAccessToken(userId);
          const refreshToken = generateRefreshToken(userId);
          
          

         return{
            user:existingUser,
            accessToken:accessToken,
            refreshToken:refreshToken
         }
    }

    async verifyToken(token: string): Promise<{ accessToken: string; newRefreshToken: string }> {
        try {
            logger.info('Starting token verification');

            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as { userId: string };

            const user = await this._userRepository.findById(decoded.userId);
            
            if (!user || !user._id) {
                logger.error('User not found or user ID is missing');
                throw new Error('User not found or user ID is missing');
            }

            const accessToken = generateAccessToken(user._id);
            const newRefreshToken = generateRefreshToken(user._id);

            logger.info('Token verification successful, returning new tokens');


            return {
                accessToken,
                newRefreshToken
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
    async resendOTP({ email }: { email: string; }): Promise<void> {
              const otp = crypto.randomInt(1000, 9999).toString();

              console.log("new OTP",otp );
              console.log("new Email",email );
              
              await this._otpRepository.updateOtp(email, otp);

             const userData= await this._userRepository.findByEmail(email)
              console.log(userData,"user");
              
            
             if(!userData){
                 throw new InvalidTokenError('There is no user  with this email')
             }

              await this._emailServices.sendEmail({
                  to: userData.email!,
                  subject: "Welcome To Escriber, Our Blog Platform!",
                  text: `Hi ${userData.username}, welcome to our platform! We're excited to have you here.Your Otp Is ${otp}`
              });
      
    }
   

    async saveProfileImage(imageBuffer: Buffer, userId: string): Promise<string> {
        try {
            const user = await this._userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            let existingImageUrl = user.image; 
            console.log("existing ",existingImageUrl);
            
            let existingImageId = null;
    
          
            if (existingImageUrl) {
                const existingImageParts = existingImageUrl.split('/');
                existingImageId = existingImageParts[existingImageParts.length - 1].split('.')[0]; 
            }
    
            if (existingImageId) {
                await cloudinary.uploader.destroy(existingImageId);
                console.log("Deleted existing image:", existingImageId);
            }
    
            const newImageUrl = await new Promise<string>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'Escribir_Profile_Images' },
                    (error, result) => {
                        if (error) {
                            logger.error("Cloudinary upload error:", error);
                            return reject(new Error('Cloudinary upload failed'));
                        }
                        if (result && result.secure_url) {
                            resolve(result.secure_url);
                        } else {
                            reject(new Error('Failed to get secure URL from Cloudinary response'));
                        }
                    }
                );
    
                uploadStream.end(imageBuffer);
            });
    
          
            const updateResult = await this._userRepository.updateUserDetails(userId, { image: newImageUrl });
            console.log("Update Result:", updateResult);
            
    
            return newImageUrl;
    
        } catch (error) {
            logger.info("Error in uploading profile image", error);
            throw new Error('Failed to upload profile image');
        }
    }
    
    

    
}
