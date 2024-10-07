
import { IBlogPost } from "../../entities/Blog.Post";
 
 export interface IBlogRepository{
    create(blogPostData: Partial<IBlogPost>): Promise<IBlogPost> ,
    findAll(): Promise<IBlogPost[]>
 }