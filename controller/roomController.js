import createError from 'http-errors';
import User from '../models/User.js';
import Room from '../models/Room.js'
import bcryptjs from 'bcryptjs';
import config from '../config/config.js'


//First Draft stopped working here
export const createEmptyRoom = async (req, res, next) => {
    const {id: userId}  = req.params
    const {roomName='noName', users=[]} = req.body
    users.push(userId)
    
    try{
        const data = {roomName, users}
        const room = await Room.create(data);
        const updateEgo = await User.findById(userId)
        updateEgo.rooms.push(room._id)
        await updateEgo.save()
        res.send({newRoom: room, user: {id: updateEgo.username, rooms: updateEgo.rooms}})
        }
    catch(error){
      next(error)
    }
}

export const inviteFriend = async (req, res, next) => {
  const {id: userId, roomId}  = req.params
  const {friendId} = req.body
  try {
    const user = await User.findById(userId)
    const permission = await user.checkMember(roomId)
    if (!permission){
      throw new createError(404, `You have no permission for this task, run!`);
    }
    const updateFriend = await User.findById(friendId)
    const updateRoom = await Room.findById(roomId)
    updateFriend.rooms.push(roomId)
    updateRoom.users.push(friendId)
    await updateFriend.save()
    await updateRoom.save()
    res.send({success: `${updateFriend.username} joined ${updateRoom.roomName}`})

  }
  catch(error){
      next(error)
    }
}

