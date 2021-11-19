import createError from 'http-errors';
import User from '../models/User.js';
import Room from '../models/Room.js';
import bcryptjs from 'bcryptjs';
import config from '../config/config.js'

//ADDING a new user
export const addUser = async (req, res, next) => {
  const info = req.body;
  try {
    const user = await User.create(info);
    user.password = undefined;
    
    const token = user.generateAuthToken();
    
    res
      .cookie('token', token, {
        expires: new Date(Date.now() + 172800000),
        sameSite: config.ckSameSite,
        secure: config.ckSecure, 
        httpOnly: true,
      })
      .send(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const user = req.user
  const update = req.body
  try {
    Object.assign(user, update);
    const userUpdated = await req.user.save(); // => this will trigger the pre save hook
    res.send(userUpdated)
  }
  catch(error) {
    next(error)
  }
}

//LOGIN
export const loginUser = async (req, res, next) => {
  console.log('LOGIN REQUESTED: ', req.body)  
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username})
      .populate({
        path: 'friends',
        select: 'username online'
      })
      .populate({
        path: 'rooms.room',
        roomName: {type: String, required: true},
        select: 'roomName users private',
          populate: {
            path: 'users',
            select: 'username online'
        }
      })
    if (!user) throw new createError(404, `Username not valid`);
    
    const passwordIsValid = bcryptjs.compareSync(password, user.password);
    if (!passwordIsValid) next(createError(404, `Password is not valid`));
    const token = user.generateAuthToken();

    const respond = user.toObject();
    delete respond.password
    
    res
      .cookie('token', token, {
        expires: new Date(Date.now() + 172800000),
        sameSite: config.ckSameSite,
        secure: config.ckSecure, 
        httpOnly: true,
      })
      .send(respond)
  } catch(error){
    next(error)
  }
}; 

//FIND User using an id inside req.body 
export const findUserById = async(req, res, next) => {
  const id = req.body
  try{
    const user = await User.findOne(id).select('username email')
    res.send(user)
  } catch(error) {
    next(error)
  }
}

//Find User using key=value
export const findUserKeyValue = async(req, res, next) => {
  try{
    console.log('WHAT ARRIVES: ', req.search)
    const user = await User.find(req.search).select('username avatar online')
    res.send(user)
  } catch(error) {
    next(error)
  }
}

export const addFriend = async(req, res, next) => {
  const {id: userId} = req.params
  const {friendId} = req.body
  try {
    const updateEgo = await User.findById(userId)
    
    if (updateEgo.checkFriend(friendId)) {
      throw new createError(404, `Friend already exists`);
    }

    //Create a shared room
    const roomData = {
      roomName: `privatChat-${userId}-${friendId}`,
      users: [userId, friendId],
      private: true
    }
    console.log('create a new room')
    const newRoom = await Room.create(roomData)

    //Share room infos with user and friend 
    updateEgo.friends.push(friendId)
    updateEgo.rooms.push({room: newRoom._id, unread: 0})
    await updateEgo.save()
    console.log(updateEgo, ' got updated')
    console.log('updateOther: ',friendId, newRoom._id)
    
    const updateOther = await User.findByIdAndUpdate(
      friendId,
      {$push: {friends: userId, rooms: {room: newRoom._id, unread: 0}}},
      {new: true}
    )
  
    res.send({
     friend: updateOther,
     room:  newRoom })
  } catch(error){
    next(error)
  }
}

//VERIFYING Cookie, is it working??
export const verifyCookie = (req, res) => {
  res.send(req.user);
};

//LOGOUT
export const logout = (req, res) => {
  res
    .clearCookie("token")
    .json({
      message: "Logged you out successfully"
    })
}