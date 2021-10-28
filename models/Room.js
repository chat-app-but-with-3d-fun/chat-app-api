import mongoose from 'mongoose';
import config from '../config/config.js'

const {Schema, model} = mongoose;

const KEY = config.secretKey

const RoomSchema = new Schema(
  {
    roomName: {type: String, required: true, unique: true},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}]
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

const Room = model('Room', RoomSchema); 

export default Room;