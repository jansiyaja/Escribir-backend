import mongoose,{ Schema } from "mongoose";
import { BlogStatus, IBlogPost } from "../../entities/Blog";
const blogPostSchema = new Schema<IBlogPost>({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User',
    },
    heading: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
       viewedBy: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
}],
    content: {
        type: Object,
        required: true,
    },
    coverImageUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(BlogStatus),
        default: BlogStatus.DRAFT, 
    },
     reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction',
    }],
       comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],

},
{timestamps:true},

);

const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
export default BlogPost;