import mongoose,{ Schema } from "mongoose";
import { IBlogPost } from "../../entities/Blog.Post";
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
    content: {
        type: Object,
        required: true,
    },
    coverImageUrl: {
        type: String,
        required: true,
    },

},
{timestamps:true},

);

const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
export default BlogPost;