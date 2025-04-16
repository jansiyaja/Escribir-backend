import { IComment } from "../../entities/IComment";

export interface ICommentUseCase{
     addComment(postId: string, userId: string, content: string, autherId: string): Promise<IComment> 
    reactToComment(commentId: string, emoji: string): Promise<IComment> 
    replyToComment(parentCommentId:string,userId:string,content:string):Promise<IComment>
}