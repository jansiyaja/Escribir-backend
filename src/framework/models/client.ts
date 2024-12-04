import mongoose, { Schema } from "mongoose";
import { IClient } from "../../entities/IClient";


const ClientSchema: Schema = new Schema<IClient>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  paymentId: { type: String, required: true },
  paymentAmount: { type: String, required: true },
  businessName: { type: String, required: true },
  maxAds: { type: Number }, 
  activeAds: { type: Number, default: 0 }, 
   advertisements: { type: Schema.Types.ObjectId, ref: "Advertisement",},
}, { timestamps: true });

export default mongoose.model<IClient>("Client", ClientSchema);
