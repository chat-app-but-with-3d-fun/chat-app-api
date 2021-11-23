import createError from 'http-errors';
import User from '../models/User.js';
import Room from '../models/Room.js'
import Message from '../models/Message.js'

export const createMessage = async(req, res, next) => {
    const {roomId, type, message} = req.body
    const user = req.user
    try {
        const permission = await user.checkMember(roomId)
        if (!permission){
            throw new createError(404, `You have no permission for this task, run!`);
        }
        const data = {
            message: message,
            sender: user._id,
            type: type,
            room: roomId
        }
        const newMsg = await Message.create(data)
        const roomUpdated = await Room.findByIdAndUpdate(
            roomId,
            {$push: {messages: newMsg._id}},
            {new: true}
        )
        res.send({
            success: `${newMsg.message} added to ${roomUpdated.roomName} at position ${roomUpdated.messages.length}`
        })
    } catch(err) {
        next(err)
    }
}

export const getMessages = async (req, res, next) => {
    const {roomId} = req.params
    const user = req.user
    try {
        // const permission = await user.checkMember(roomId)
        // console.log('permission: ', permission) 
        // if (!permission){
        //      throw new createError(404, `You have no permission for this task, run!`);
        //  }
        const room = await Room.findById(roomId).populate({
            path: 'messages',
            select: 'message sender type createdAt',
            populate: {
                path: 'sender',
                select: '_id username'
            }
        })

        //Set unread messages back to 0 for User
        const userUpdated = await User.findOneAndUpdate(
                {user, "rooms.room" : roomId},
                {$set: {"rooms.$.unread": 0} }
            )
        
        const unreadMessages = userUpdated.rooms
            .find( element => {
                return `${element.room}` === roomId 
            }) 

        //return messages and number of unread messages in this chat
        res.send({
            unread: unreadMessages.unread,
            messages: room.messages
        })

    } catch(err) {
        next(err)
    }
}