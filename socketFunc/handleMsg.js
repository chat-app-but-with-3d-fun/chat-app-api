import createError from 'http-errors';


import User from "../models/User.js"
import Room from '../models/Room.js'
import Message from '../models/Message.js'

//Msg goes to the room
export const newMsg = async(socket, userId, payload) => {
    console.log(payload, userId)
    const {room, type, message} = payload
    try {
        const user = await User.findById(userId)
        if (type==='chat'){
            const permission = await user.checkMember(room)
            if (!permission){
             throw new createError(404, `You have no permission for this task, run!`);
            }   
            const data = {
                type, message, room,
                sender: userId
            }
            const newMsg = await Message.create(data)
            const roomUpdated = await Room.findByIdAndUpdate(
                room,
                {$push: {messages: newMsg._id}},
                {new: true}
            )
                console.log('new message to ', `room-${room}` )
                socket.to(`room-${room}`).emit('newMsg', message)
            }
        //this private only used for testing with firecamp...
        else if (type === 'private'){
            socket.to(`private-${room}`).emit('newMsg', message)
        } 
    } catch(err) {
        console.log('ERROR: ',err)
    }

}