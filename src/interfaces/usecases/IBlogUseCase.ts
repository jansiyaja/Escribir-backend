import { IBlogPost } from "../../entities/Blog.Post"
export interface IBlogUseCase{

createBlogPost(blogPostData: Partial<IBlogPost>): Promise<IBlogPost>
uploadImageToS3(buffer: Buffer, userId:string): Promise<string>;
getAllBlogs(): Promise<IBlogPost[]>  
}