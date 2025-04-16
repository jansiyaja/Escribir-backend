import { IComment } from "../../entities/IComment";

export  interface ICommentRepository{
    addComment(blogPostId: string, userId: string, content: string): Promise<IComment>
    findComment(blogPostId: string, userId: string, content: string): Promise<string>
    reactToComment(commentId: string, emoji: string): Promise<IComment | null>
    replyToComment(parentCommentId: string, userId: string, content: string): Promise<IComment>
}
