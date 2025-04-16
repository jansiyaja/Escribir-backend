import { IBlogPost } from "../../entities/Blog"
import { IReaction } from "../../entities/IReaction";
import { ITag } from "../../entities/ITag";

export interface IBlogUseCase {

    createBlogPost(blogPostData: Partial<IBlogPost>): Promise<IBlogPost>
    uploadImageToS3(buffer: Buffer, userId: string): Promise<string>;
    getAllBlogs(): Promise<IBlogPost[]>

    getsingleBlog(blogId: string ,userId:string): Promise<{ blog: IBlogPost }>
    userBlogs(userId: string): Promise<{ blogs: IBlogPost[] }>;
    deletePost(postId: string): Promise<IBlogPost>;
    updateBlog(id: string, blogData: Partial<IBlogPost>): Promise<IBlogPost>
    reportBlog(id: string, userId: string, reason: string): Promise<IBlogPost>;
    addReaction(blogPostId: string, userId: string, reactionType: string, autherId: string): Promise<IReaction>;
    removeReaction(reactionId: string, userId: string, reactionType: string, autherId: string): Promise<void>
  

    getAllTags(): Promise<ITag[]>;
    getTagBYBlogs(tag:string | string[] | undefined): Promise<IBlogPost[]>
    getTrendingTags(): Promise<{ tag: string, views: number }[]>
   getTrendingBlogs(): Promise<(IBlogPost & { views: number })[]>
}