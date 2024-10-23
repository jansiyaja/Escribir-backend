import { IReaction } from "../../entities/IReaction";

export interface IReactionRepository{
    findReaction(blogPostId: string, userId: string,reactionType: string): Promise<IReaction | null>
    addReaction(blogPostId: string, userId: string, reactionType: string): Promise<IReaction>;
  removeReaction(blogPostId: string, userId: string,reactionType: string, ): Promise<void>
     
    
    
}