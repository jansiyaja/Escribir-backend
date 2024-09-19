import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUser } from "../../entities/User";
import UserModel from "../../framework/database/models/user";


export class UserRepository  implements IUserRepository{

 async create(user: IUser): Promise<IUser> {
    const newUser = new UserModel(user);
    return newUser.save()

 }
 async findById(id: string): Promise<IUser | null> {
     return await UserModel.findById(id).lean().exec();
 }

 async findByEmail(email: string): Promise<IUser | null> {
     return await UserModel.findOne({email}).lean().exec();
 }

 async update(user: IUser): Promise<IUser> {
     try {
        const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, { new: true }).lean().exec();
        
        if (!updatedUser) {
            throw new Error('User not found');
          }
          return updatedUser;

     } catch (error) {
            throw new Error(`Failed to update user: ${error}`);
     }
 }

 async delete(id: string): Promise<void> {
     await UserModel.findByIdAndDelete(id).lean().exec()
 }

 async markAsVerified(email: string): Promise<void> {
     await UserModel.findOneAndUpdate({ email: email }, { isVerified: true }, { new: true }).exec();
     
}

}