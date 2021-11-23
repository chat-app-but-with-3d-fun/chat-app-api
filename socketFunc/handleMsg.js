import createError from 'http-errors';


import User from "../models/User.js"
import Room from '../models/Room.js'
import Message from '../models/Message.js'

//Msg goes to the room
export const newMsg = async(io, socket, userId, payload) => {
    const {room, type, message} = payload
    try {
        const user = await User.findById(userId)
        if (type==='chat'){
            //check authentication for writing in group 
            const permission = await user.checkMember(room)
            if (!permission){
             throw new createError(404, `You have no permission for this task, run!`);
            }
            console.log('Permission: ', permission)
            //compose message and distribute
            const data = {
                type, message, room,
                sender: userId
            }
            const newMsg = await Message.create(data)
            newMsg = await newMsg
                .populate({
                    path: 'sender',
                    select: '_id username'
                }).execPopulate()

            console.log('NEW MSG CREATED: ', newMsg)
            const roomUpdated = await Room
            .findByIdAndUpdate(
                room,
                {$push: {messages: newMsg._id}},
                {new: true}
            )
            .populate({
                path: 'users',
                select: 'online'})

            console.log('new message to ', `room-${room}` )
            io.in(`room-${room}`).emit('newMsg', newMsg)
            

            //inform offline users
            const offlineUsers = roomUpdated.users.filter(element => {
                if (!element.online) {
                    return element._id
                }
            })
            const updateOffline = await User.updateMany(
                {_id: {$in: offlineUsers},'rooms.room': `${room}` },
                {$inc: {"rooms.$.unread" : 1}}
            )
            
        }

        //this private only used for testing with firecamp...
        else if (type === 'private'){
            socket.to(`private-${room}`).emit('newMsg', message)
        } 
    } catch(err) {
        console.log('ERROR: ',err)
    }

}