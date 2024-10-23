import { IComment } from "../../entities/IComment";
import BlogPost from "../../framework/models/blog";
import { Comment } from "../../framework/models/comment";
import { ICommentRepository } from "../../interfaces/repositories/IRepository";

export class CommentRepository implements ICommentRepository{
     async addComment(blogPostId: string, userId: string, content: string): Promise<IComment> {
         
        const newComment = new Comment({
            postId: blogPostId,
            content: content,
            userId:userId
        });

         const savedComment = await newComment.save();
         
          await BlogPost.findByIdAndUpdate(
            blogPostId,
            { $addToSet: { comments: newComment._id } }, 
            { new: true } 
        );
        return savedComment; 
    }
     
}