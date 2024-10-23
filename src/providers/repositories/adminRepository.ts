import { ObjectId } from "mongoose";
import { IAdmin } from "../../entities/Admin";
import { IUser } from "../../entities/User";
import AdminModel from "../../framework/models/admin";
import UserModel from "../../framework/models/user";
import { IAdminRepository } from "../../interfaces/repositories/IAdminRepository"; 
import { ITag } from "../../entities/ITag"; 
import TagModel from "../../framework/models/tag"; 
import { IReport } from "../../entities/IReport";
import Report from "../../framework/models/report"; 


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

    async findById(id: ObjectId): Promise<IAdmin | null> {
        return await AdminModel.findById(id).exec();
    }

    async getAllUsers(): Promise<IUser[]> {
        return await UserModel.find().lean().exec(); 
    }

    // ------------------Relatd to tag----------------------------------------------------//
    async findOne(name: string): Promise<ITag | null> {
        return await TagModel.findOne({ name });
    }

   
    async create(tagData: Partial<ITag>): Promise<ITag> {
        const newTag = new TagModel(tagData);
        return await newTag.save();
    }
    async findAll(): Promise<ITag[]> {
        return await TagModel.find().sort({ createdAt: -1 }); 
    }
    async updateTagById(tagId: string, tagData: { name: string }): Promise<ITag>{
        const updatedTag = await TagModel.findByIdAndUpdate(
            tagId, 
            { $set: tagData }, 
            { new: true }    
        );

        if (!updatedTag) {
            throw new Error("Tag not found");
        }
        return updatedTag;

    }
    async deleteTagById(tagId: string): Promise<ITag> {
        const deletedTag = await TagModel.findByIdAndDelete(tagId);
        if(!deletedTag){
            throw new Error("invalid tagId")
        }
        return deletedTag;
    }
    //----------------------------------------------------------------------------------------//
    //---------Report-------------------------------------------------------------------------------//
    async findAllReportedBlog(): Promise<IReport[]> {
        return await Report.find().sort({ createdAt: -1 });  
    }
    //----------------------------------------------------------------------------------------//

}
