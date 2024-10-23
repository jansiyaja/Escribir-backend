import mongoose, { Schema } from "mongoose";
import { IReaction, ReactionType } from "../../entities/IReaction";

const reactionSchema = new Schema<IReaction>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', 
    },
    blogPost: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BlogPost', 
    },
    reactionType: {
        type: String,
        enum: Object.values(ReactionType), 
        required: true,
    },
}, { timestamps: true });

const Reaction = mongoose.model<IReaction>('Reaction', reactionSchema);
export default Reaction;
