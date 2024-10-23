import { ObjectId } from "mongoose";
export enum ReactionType {
    LIKE = "like",
    LOVE = "love",
    HAPPY = "happy",
    SAD = "sad",
    ANGRY = "angry",
}


export interface IReaction { 
    _id:string
    user: ObjectId; 
    blogPost: ObjectId; 
    reactionType: ReactionType;

}

