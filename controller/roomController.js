import createError from 'http-errors';
import User from '../models/User.js';
import Room from '../models/Room.js';


//GET ROOM INFOS
export const getRoomInfo = async(req, res, next) => {
  const {id} = req.body
  try{
    const room = await Room.findById(id)
      .select('roomName users type')
      .populate({
        path: 'users',
        select: 'username online roomOnline'
    })
    res.send(room)
  } catch(error) {
    next(error)
  }
}

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
      {$push: {rooms: {room: room._id}}},
      {new: true}
    );
    const tmpObj = {
      room: {
        roomName: room.roomName,
        _id: room._id,
        private: room.private,
        users: room.users},
      unread: 0}
    res.send(tmpObj)
  }
  catch(err){
    next(err)
  }
}

export const inviteFriend = async (req, res, next) => {
  console.log('FRIEND IN ROOM REQUESTED!: ', req.params)
  const {roomId, friendId}  = req.params
  const user = req.user
  try {
    
    //Check permissions
    // const permissionRoom = await user.checkMember(roomId)
    // console.log('Permission ', permissionRoom)
    // const permissionFriend = await user.checkFriend(friendId)

    // if (!permissionRoom || !permissionFriend) {
    //   throw new createError(
    //     404,
    //     `You have no permission for this task, run!`
    //   );
    // }
    

    const updateFriend = await User.findByIdAndUpdate(
      friendId,
      {$addToSet: {rooms: {room: roomId, unread: 0}}},
      {new: true} )

    const updateRoom = await Room.findByIdAndUpdate(
      roomId,
      {$addToSet: {users: friendId}},
      {new: true})

    res.send({
      username: `${updateFriend.username}`,
      _id: updateFriend._id
    })
  }
  catch(err){
    next(err)
  }
}

