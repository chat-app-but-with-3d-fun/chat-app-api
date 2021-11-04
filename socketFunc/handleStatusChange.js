import User from "../models/User.js"


//If room created or got added, change socket infos
export const updateRoomStatus = async(socket, userId, friend) =>{
    console.log('Room Status requested')
    const user = await User.findById(userId)
    //Check if rooms already exist if not join
    const roomSet = socket.rooms
    for (let i=0; i<user?.rooms.length; i++){
        if (!roomSet.has(`room-${user.rooms[i]}`)){
            socket.join(`room-${user.rooms[i]}`)
            console.log('New room found and joined')
        } 
    }
    if (friend) {
        console.log('Friend attached: ', friend)
        socket.to(`private-${friend}`).emit('statusMsg', {type: 'room'}) 
    }
    
}

export const statusMsg = async(socket, userId, payload) => {
    
}