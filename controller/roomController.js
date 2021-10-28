import createError from 'http-errors';
import User from '../models/User.js';
import Room from '../models/Room.js';

// Create an empty room
export const createEmptyRoom = async (req, res, next) => {
  const user = req.user
  const {roomName='noName', users=[]} = req.body
  users.push(user._id)
  try {
    const data = {roomName, users}
    const room = await Room.create(data);
    const updateUser = await User.findByIdAndUpdate(
      user._id,
      {$push: {rooms: room._id}},
      {new: true}
    );
    res.send({
      newRoom: room,
      user: {
        id: user.username,
        rooms: updateUser.rooms
      }
    })
  }
  catch(err){
    next(err)
  }
}

export const inviteFriend = async (req, res, next) => {
  const {roomId, friendId}  = req.params
  const user = req.user
  try {
    const permission = await user.checkMember(roomId)
    if (!permission) {
      throw new createError(
        404,
        `You have no permission for this task, run!`
      );
    }
    
    const updateFriend = await User.findByIdAndUpdate(
      friendId,
      {$push: {rooms: roomId}},
      {new: true} )

    const updateRoom = await Room.findById(roomId)
    updateRoom.users.push(friendId)
    await updateRoom.save()

    res.send({
      success: `${updateFriend.username} joined ${updateRoom.roomName}`
    })
  }
  catch(err){
    next(err)
  }
}

