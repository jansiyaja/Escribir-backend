import mongoose, { Schema } from 'mongoose';
import { IChat } from '../../entities/IChat';



const ChatModelSchema: Schema = new Schema({
  Users: [{ type: Schema.Types.ObjectId, ref: 'User'  }],
  IsGroupChat: { type: Boolean,default: false },
  ChatName: { type: String ,default: null},
  GroupAdmin: { type: Schema.Types.ObjectId ,ref: 'User' ,default: null},
  LatestMessage: { type: Schema.Types.ObjectId , ref: 'Message'},
});

const ChatModel = mongoose.model<IChat>('ChatModel', ChatModelSchema);

export default ChatModel;

