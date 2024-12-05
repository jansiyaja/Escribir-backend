import { ObjectId } from "mongoose";
import { IAdmin } from "../../entities/Admin";
import { IUser } from "../../entities/User";
import { ITag } from "../../entities/ITag"; 
import { IReport } from "../../entities/IReport"; 
import { IBlogPost } from "../../entities/Blog";
import { IClient } from "../../entities/IClient";
 


export interface IAdminRepository{
    findByEmail(email: string): Promise<IAdmin | null>;
    findById(id:ObjectId):Promise<IAdmin|null>;
    saveAdmin(adminData: Partial<IAdmin>): Promise<IAdmin>;
    getAllUsers(): Promise<IUser[]>;
//-----------------------------------------------------------------------------------//
    create(tagData: Partial<ITag>): Promise<ITag> ,
    findOne(name: string): Promise<ITag | null> ;
    findAll(): Promise<ITag[]>;
    updateTagById(tagId: string, tagData: { name: string }): Promise<ITag> ;
    deleteTagById(tagId: string): Promise<ITag> 

 //-----------------------------------------------------------------------------------//
 //-----------------------------------------------------------------------------------//
    findAllReportedBlog(): Promise<IReport[]>;
    getAllBlog(): Promise<IBlogPost[]>
    //-----------------------------------------------------------------------------------//
    
    //-----------------------------------------------------------------------------------//
    getAllClient(): Promise<IClient[]> 
 //-----------------------------------------------------------------------------------//
}