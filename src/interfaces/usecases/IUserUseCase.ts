
import { INotification } from "../../entities/INotification";
import { IUser } from "../../entities/User";


export interface IUserUseCase{

   registerUser(userData: Partial<IUser>):  Promise<{ user: IUser}>;


   verifyOTP(params: { otp: string; email: string }): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;

   loginUser(userData: Partial<IUser>): Promise<{ user: IUser; accessToken: string; refreshToken: string }>;

   verifyToken(token: string): Promise<{ accessToken: string }> 

   resendOTP({email}:{email:string}):Promise<void>
   
   saveProfileImage(imageBuffer: Buffer,userId:string): Promise<string>
   
    updateProfile(userId: string, profileData:  Partial<IUser>) : Promise<{user:IUser}>;

    getProfile(userId:string): Promise<{user:IUser}>;

  sendFeedbackEmail(name: string, email: string, message: string): Promise<string>

   getAllNotifications(userId: string): Promise<INotification[]> ;

   sendNotifications(followerId: string, userId: string): Promise<void>
   
  

   
}

