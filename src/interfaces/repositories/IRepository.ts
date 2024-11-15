import { IComment } from "../../entities/IComment";

export  interface ICommentRepository{
    addComment(blogPostId: string, userId: string, content: string): Promise<IComment>
    findComment(blogPostId: string, userId: string, content: string): Promise <string>
}
