
import { IBlogPost } from "../../entities/Blog"
import { IComment } from "../../entities/IComment";
import { IReaction } from "../../entities/IReaction"; 
import { ITag } from "../../entities/ITag";

export interface IBlogUseCase{

createBlogPost(blogPostData: Partial<IBlogPost>): Promise<IBlogPost>
uploadImageToS3(buffer: Buffer, userId:string): Promise<string>;
getAllBlogs(): Promise<IBlogPost[]>  
getAllTags(): Promise<ITag[]>;
getsingleBlog(blogId:string): Promise<{blog:IBlogPost}>
userBlogs(userId: string): Promise<{ blogs: IBlogPost[] }>;
deletePost(postId: string): Promise<IBlogPost>;
updateBlog( id:string,blogData: Partial<IBlogPost>): Promise<IBlogPost> 
    reportBlog(id: string, userId: string, reason: string): Promise<IBlogPost>;
    addReaction(blogPostId: string, userId: string, reactionType: string, autherId: string): Promise<IReaction>;
    removeReaction(reactionId: string,userId: string, reactionType: string,autherId:string):Promise<void>
    addComment(postId: string,userId: string, content:string,autherId:string):Promise<IComment>

}