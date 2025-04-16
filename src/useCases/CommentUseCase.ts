import { IComment } from "../entities/IComment";
import { IBlogRepository } from "../interfaces/repositories/IBlogRepository";
import { INotificationRepository } from "../interfaces/repositories/INotificationRepository";
import { ICommentRepository } from "../interfaces/repositories/ICommentRepository";
import { ICommentUseCase } from "../interfaces/usecases/ICommentUseCase";

    
export class CommentUseCase implements ICommentUseCase {
    constructor(
            private _blogRepository: IBlogRepository,
            private _notificationRepo: INotificationRepository,
            private _commentRepository: ICommentRepository,
       
    ) { }
    
    
    
    async addComment(postId: string, userId: string, content: string, autherId: string): Promise<IComment> {
        const blogPost = await this._blogRepository.findById(postId);

        console.log(postId,userId,autherId ,"=> thisi is usecase add comment");
        

        if (!blogPost) {
            throw new Error('Blog post not found');
        }

        await this._notificationRepo.sendNotification(autherId, userId, `reacted to your post with ${blogPost.heading}`,);

        const aleradyExist = await this._commentRepository.findComment(postId, userId, content)
        if (aleradyExist) {
            console.log("this comment is already exist with same user");

        }

        return await this._commentRepository.addComment(postId, userId, content);


    }
async reactToComment(commentId: string, emoji: string): Promise<IComment> {
  const comment = await this._commentRepository.reactToComment(commentId, emoji);
  if (!comment) throw new Error("Failed to add reaction");
  return comment;
    }
    
  async replyToComment( parentCommentId: string, userId: string, content: string): Promise<IComment> {
    return this._commentRepository.replyToComment( parentCommentId, userId, content);
  }

}