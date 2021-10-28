import mongoose from 'mongoose';
import config from '../config/config.js'

const {Schema, model} = mongoose;

const KEY = config.secretKey

const MessageSchema = new Schema(
  {
    message: {type: String, required: true},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    room: {type: Schema.Types.ObjectId, ref: 'Room'},
    type: {type: String, required: true}
  },
  {
    versionKey: false,
    timestamps: true,
    id: false,
    toJSON: {
      virtuals: true,
    },
  }
);

const Message = model('Message', MessageSchema); 

export default Message;