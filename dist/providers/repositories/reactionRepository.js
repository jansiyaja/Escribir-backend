"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blog_1 = __importDefault(require("../../framework/models/blog"));
const reaction_1 = __importDefault(require("../../framework/models/reaction"));
class ReactionRepository {
    async findReaction(blogPostId, userId, reactionType) {
        return await reaction_1.default.findOne({ blogPost: blogPostId, user: userId }).exec();
    }
    async addReaction(blogPostId, userId, reactionType) {
        const newReaction = new reaction_1.default({
            blogPost: blogPostId,
            user: userId,
            reactionType,
        });
        await blog_1.default.findByIdAndUpdate(blogPostId, { $addToSet: { reactions: newReaction._id } }, { new: true });
        return await newReaction.save();
    }
    async removeReaction(blogPostId, userId, reactionType) {
        try {
            const reaction = reactionType.toLowerCase();
            const reactions = await reaction_1.default.findOne({ blogPost: blogPostId, user: userId, reactionType: reaction });
            console.log(reactions);
            if (!reactions) {
                console.log('Reaction not found for this blog post.');
                return;
            }
            await reaction_1.default.findByIdAndDelete(reactions._id);
            await blog_1.default.updateOne({ _id: blogPostId }, { $pull: { reactions: reactions._id } });
            console.log(`Reaction removed from both Reaction collection and BlogPost.`);
        }
        catch (error) {
            console.error("Error removing reaction:", error);
        }
    }
}
exports.default = ReactionRepository;
