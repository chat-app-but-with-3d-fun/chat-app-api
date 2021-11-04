import mongoose from 'mongoose';
import config from '../config/config.js'

const {Schema, model} = mongoose;

const KEY = config.secretKey

const RoomSchema = new Schema(
  {
    roomName: {type: String, required: true},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    private: {type: Boolean, required: true, default: false}
  
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

RoomSchema.methods.userInside = function (userId) {
  const user = this
  return room.users?.includes(userId)
}


const Room = model('Room', RoomSchema); 

export default Room;