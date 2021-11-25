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
            // const permission = await user.checkMember(room)
            // if (!permission){
            //  throw new createError(404, `You have no permission for this task, run!`);
            // }
            // console.log('Permission: ', permission)
            //compose message and distribute
            const data = {
                type, message, room,
                sender: userId
            }
            const newMsg = await Message.create(data)
            const popMsg = await Message.findById(newMsg._id)
                .populate({
                    path: 'sender',
                    select: '_id username'
                })

            console.log('NEW MSG CREATED: ', newMsg)
            console.log('MSG sent back: ', popMsg)
            const roomUpdated = await Room
            .findByIdAndUpdate(
                room,
                {$push: {messages: newMsg._id}},
                {new: true}
            )
            .populate({
                path: 'users',
                select: 'online roomOnline'})

            console.log('new message to ', `room-${room}` )
            io.in(`room-${room}`).emit('newMsg', popMsg)
            

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

            //inform the users not in room
            // const notActiveUsers = await roomUpdated.users.filter(element => {
            //     if (!element.roomOnline != room) {
            //         return element._id
            //     }
            // }) 

            // const updateNotActive = await User.updateMany(
            //     {_id: {$in: notActiveUsers},'rooms.room': `${room}` },
            //     {$inc: {"rooms.$.unread" : 1}}
            // )
            
            // notActiveUsers.forEach((element) => {
            //     const tmpObj = {
            //         type, message, room,
            //         sender: user.username
            //     }
            //     socket.to(`private-${element._id}`).emit('notification', tmpObj)
            //     console.log('A notification was sent to ', element._id, tmpObj)
            //  })   



        }

        //this private only used for testing with firecamp...
        else if (type === 'private'){
            socket.to(`private-${room}`).emit('newMsg', message)
        } 
    } catch(err) {
        console.log('ERROR: ',err)
    }

}


export const newNote = async(io, socket, userId, payload) => {
    const {room, type, message} = payload
    console.log('new NOTE ARRIVED: ', payload)
    console.log('DESTRUCTURING WORKS: ', room, type, message)
    try {
        if (type ==='note'){
            console.log('IF WORKS!')
            const data = {
                type, message, room,
                sender: userId
            }
            const newMsg = await Message.create(data)
            // const popMsg = await Message.findById(newMsg._id)
            //     .populate({
            //         path: 'sender',
            //         select: '_id username'
            //     })

            console.log('NEW NOTE CREATED: ', newMsg)
            // console.log('MSG sent back: ', popMsg)
            const roomUpdated = await Room
                .findByIdAndUpdate(
                    room,
                    {$push: {messages: newMsg._id}},
                    {new: true}
                )

            console.log('new NOTE to ', `room-${room}` )
            io.in(`room-${room}`).emit('noteChange', newMsg)
        }   
    }
    catch(error){
        console.log('ERROR: ',error)
    }
}

export const getNotes = async( socket, userId, payload) => {
    const {room} = payload
    console.log('GET NOTES REQUESTED: ', room)
    try {
        const roomMsg = await Room.findById(room)
        .populate({
            path: 'messages',
            select: 'message sender type createdAt'
        })
        console.log('FOUND NOTES: ', roomMsg)
        const noteOnly = roomMsg?.messages.filter( element => {
            return element.type === 'note'
        })
        socket.emit('oldNote', noteOnly)
    }
    catch(error){
        console.log(error)
    }
}