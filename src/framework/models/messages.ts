import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../../entities/IMessage';


const MessageSchema: Schema = new Schema({
  Sender_id: { type: Schema.Types.ObjectId ,ref: 'User'},
  Chat: { type: Schema.Types.ObjectId, ref:'ChatModel' },
  Content: { type: String ,require:true },
  ReadBy: { type: Boolean,default: false},
}, {
    timestamps:true
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

