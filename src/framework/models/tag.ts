import mongoose,{ Schema, } from "mongoose";
import { ITag } from "../../entities/ITag";

const tagSchema = new Schema({
    name: {
         type: String, 
         required: true, 
         unique: true
         }
},{
    timestamps:true
}
);
const TagModel= mongoose.model<ITag>("Tag", tagSchema);
export default TagModel;