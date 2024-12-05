import { IAdmin } from "../../entities/Admin";
import { ITag } from "../../entities/ITag";
import { IReport } from "../../entities/IReport";
import { IUser } from "../../entities/User";
import { IBlogPost } from "../../entities/Blog";
import { IClient } from "../../entities/IClient";

 export interface IAdminUseCase{
    
    loginAdmin(adminData: Partial<IAdmin>): Promise<{  user: IAdmin ; accessToken: string; refreshToken: string }>
    verifyToken(token: string): Promise<{ accessToken: string }> 

    getAllUsers(): Promise<IUser[]> ;
    blockUser(userId: string): Promise<IUser | null>
    unblockUser(userId: string): Promise<IUser | null>
  
    //----------Realated Tags----------------------------------------------------------//

    createTag(tagData: Partial<ITag>): Promise<ITag>
    getAllTags(): Promise<ITag[]>  
    updateTags(tagData:Partial<ITag>): Promise<ITag>;
    deleteTag(tag_id: string): Promise<ITag> 

    //----------------------------------------------------------------------------------//
    //----------------------------------------------------------------------------------//
    getAlReports(): Promise<IReport[]> 
   getAllBlogs(): Promise<IBlogPost[]> ;

    //----------------------------------------------------------------------------------//

    //----------------------------------------------------------------------------------//
      getAllClient(): Promise<IClient[]> 
    //----------------------------------------------------------------------------------//
 }