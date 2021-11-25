import User from "../models/User.js"


//If room created or got added, change socket infos
export const updateRoomStatus = async(socket, userId, payload) =>{
    
    const {type = null, friend = null} = payload
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
        socket.to(`private-${friend}`).emit('statusMsg', {type}) 
    }
    
}

export const statusMsg = async(socket, userId, payload) => {
    
}

export const updateActiveRoom = async(socket, userId, payload) => {
    const {room} = payload
    try{
    const user = await User.findByIdAndUpdate(userId, {roomOnline: room}, {upsert: true})
    console.log('ROOM UPDATED: ', user)
    socket.emit('roomUpdate', user)
    }
    catch(error){
        console.log(error)
    }
}