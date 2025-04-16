import { IComment } from "../../entities/IComment";
import BlogPost from "../../framework/models/blog";
import Comment from "../../framework/models/comment";

import { ICommentRepository } from "../../interfaces/repositories/ICommentRepository";

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

    async findComment(blogPostId: string, userId: string, content: string): Promise <string>{
        
      const exixst=await Comment.findOne({ postId: blogPostId,
            content: content,
       userId: userId
      })
        console.log(exixst);
        
       return "that is alredyExist" 
    }
    
    
    
   async reactToComment(commentId: string, emoji: string): Promise<IComment | null> {
       const comment = await Comment.findById(commentId)
           .populate('replies')
         .sort({ createdAt: -1 });

  if (!comment) {
    throw new Error("Comment not found");
  }


  const existingReaction = comment.reactions.find((r) => r.emoji === emoji);

  if (existingReaction) {
    existingReaction.count += 1;
  } else {
    comment.reactions.push({ emoji, count: 1 });
  }

  const updatedComment = await comment.save();
  return updatedComment;
    }
    
    async replyToComment(parentCommentId: string, userId: string, content: string): Promise<IComment> {
         
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      throw new Error("Parent comment not found");
    }

    const replyComment = new Comment({
     postId: parentComment.postId,
      content,
      userId,
      parentCommentId,
    });

 const savedReply = await replyComment.save();
parentComment.replies.push(savedReply._id);
await parentComment.save();

    return savedReply;
  }

}