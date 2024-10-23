

import { IBlogPost } from "../../entities/Blog";
import { ITag } from "../../entities/ITag";
import { IReport } from "../../entities/IReport";
 
 export interface IBlogRepository{
    create(blogPostData: Partial<IBlogPost>): Promise<IBlogPost> ,
    findAll(): Promise<IBlogPost[]>  
    findAllTags(): Promise<ITag[]>;
    findById(id: string): Promise<IBlogPost | null>                           
    findByUserId(authorId: string): Promise<IBlogPost[] | null>  ;
    delete(id: string): Promise<IBlogPost | null>  ;
    update(id: string, blogPostData: Partial<IBlogPost>): Promise<IBlogPost | null>   ;
    createReport(report: IReport): Promise<IReport>    
   
 }