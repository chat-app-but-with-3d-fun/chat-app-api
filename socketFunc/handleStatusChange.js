import User from "../models/User.js"


//If room created or got added, change socket infos
export const updateRoomStatus = async(socket, userId, payload) =>{
    
    const {type = null, friend = null, updateRoom = null} = payload
    console.log('Room Status requested')
    const user = await User.findById(userId)
    //Check if rooms already exist if not join
    const roomSet = socket.rooms
    for (let i=0; i<user?.rooms.length; i++){
        if (!roomSet.has(`room-${user.rooms[i].room}`)){
            socket.join(`room-${user.rooms[i].room}`)
            console.log('New room found and joined')
        } 
    }
    if (friend && type) {
        console.log('Friend attached: ', friend, {type})
        socket.to(`private-${friend}`).emit('statusMsg', {type, updateRoom}) 
    }
    
}

export const statusMsg = async(socket, userId, payload) => {
    
}

export const updateActiveRoom = async(socket, userId, payload) => {
    const {newRoom, oldRoom} = payload
    console.log('User left room: ', oldRoom, ' and joined: ', newRoom)
    try{
    const user = await User.findByIdAndUpdate(userId, {roomOnline: newRoom}, {upsert: true})
    console.log('ROOM UPDATED: ', user)
    if (oldRoom){
        socket.to(`room-${oldRoom}`).emit('leftRoom', {user: userId, room: oldRoom})
    }
    if (newRoom){
        socket.to(`room-${newRoom}`).emit('joinRoom', {user: userId, room: newRoom})
    }
    }
    catch(error){
        console.log(error)
    }
}