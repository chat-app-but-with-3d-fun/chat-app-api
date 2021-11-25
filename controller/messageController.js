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
        console.log('A MESSAGE SHOULD BE DISTRIBUTED to ROOM: ', roomid)
        console.log('THIS IS THE MESSAGE: ', data)
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

        const chatOnly = room.messages.filter( element => {
            return element.type === 'chat'
        })

        const updateUser = await User.findOneAndUpdate(
            {_id: user._id},
            {$set: {"rooms.$[el].unread": 0}},
        {
           arrayFilters: [{"el.room": roomId}],
           new: true 
        })
        
        console.log('THE ROOM WE ARE TALKING ABOUT: ', roomId)
        console.log('USER UPDATED: ', updateUser)
        console.log('THE USER WE TALKING ABOUT!!!', user)
        
            // const unreadMessages = userUpdated.rooms
            // .find( element => {
            //     return `${element.room}` === roomId 
            // }) 

        //return messages and number of unread messages in this chat
        
        res.send({
            messages: chatOnly
        })

    } catch(err) {
        next(err)
    }
}