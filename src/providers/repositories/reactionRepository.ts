import { IReaction } from "../../entities/IReaction";
import BlogPost from "../../framework/models/blog";
import Reaction from "../../framework/models/reaction";
import { IReactionRepository } from "../../interfaces/repositories/IReactionRepository";

export default class ReactionRepository implements IReactionRepository {
    
      async findReaction(blogPostId: string, userId: string,reactionType: string): Promise<IReaction | null> {
        return await Reaction.findOne({ blogPost: blogPostId, user: userId }).exec();
    }
    async addReaction(blogPostId: string, userId: string, reactionType: string): Promise<IReaction> {
     const newReaction = new Reaction({
            blogPost: blogPostId,
            user: userId,
            reactionType,
     });
        
          await BlogPost.findByIdAndUpdate(
            blogPostId,
            { $addToSet: { reactions: newReaction._id } }, 
            { new: true } 
        );

        return await newReaction.save();
    }

    async removeReaction(blogPostId: string, userId: string, reactionType: string,): Promise<void> {
      
       
        try {
        const reaction=reactionType.toLowerCase()

        const reactions = await Reaction.findOne({ blogPost: blogPostId, user: userId,reactionType:reaction});
        console.log(reactions);
        

        if (!reactions) {
            console.log('Reaction not found for this blog post.');
            return;
        }

       
        await Reaction.findByIdAndDelete(reactions._id);

      
        await BlogPost.updateOne(
            { _id: blogPostId }, 
            { $pull: { reactions: reactions._id } } 
        );

        console.log(`Reaction removed from both Reaction collection and BlogPost.`);
    } catch (error) {
        console.error("Error removing reaction:", error);
    }
}

         
          
        
    }

   

    
 
