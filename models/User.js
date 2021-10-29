import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import config from '../config/config.js'

const { Schema, model } = mongoose;

const KEY = config.secretKey

const UserSchema = new Schema(
  {
    username: {type: String, required: true, unique: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true },
    socketId: {type: String},
    rooms: [{type: Schema.Types.ObjectId, ref: 'Room' }],
    friends: [{type: Schema.Types.ObjectId, ref: 'User', unique: true }],
    avatar: {type: String},
    online: {type: Boolean, default: false}
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

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  user.password = bcryptjs.hashSync(user.password, 9);
  console.log('PW GET HASHED: ', user.password)
  next();
});


UserSchema.methods.generateAuthToken = function () {
  const user = this; 
  const token = jwt.sign({ _id: user._id }, KEY, {
    expiresIn: '2d',
  });
  console.log(`We created a token for user ${user._id} => ${token}`);
  return token;
};

UserSchema.methods.checkMember = function (roomId) {
  const user = this; 
  return user.rooms?.includes(roomId)   
};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  try {
    let decoded = jwt.verify(token, KEY);
    return User.findOne({ _id: decoded._id });
  } catch (err) {
    return;
  }
};

const User = model('User', UserSchema); 

export default User;