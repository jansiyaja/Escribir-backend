import mongoose, { Schema } from "mongoose";
import { AdContent, IAdvertisement } from "../../entities/IAdvertisement";


const AdvertisementSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    targetAudience: { type: String, required: true },
    industry: { type: String, required: true },
    format: { type: String, enum: ["Video Ad", "Image Ad", "Text Ad"], required: true },
    link: { type: String, required: true },
    contents: [
      {
        type: { type: String,  enum: Object.values(AdContent), required: true },
        value: { type: String, required: true },
      },
    ],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.model<IAdvertisement>("Advertisement", AdvertisementSchema);
