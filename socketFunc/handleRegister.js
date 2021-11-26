import User from "../models/User.js"

export const registerUser = async(userId, socket, io) => {
    //Add Status online to User and get the Friends incl status
    const user = await User.findByIdAndUpdate(userId,
            {socketId: socket.id,
             online: true},
            {new: true}).
            populate({
                 path: 'friends',
                select: 'online username socketId'})
    
    //Check who is online
    const friendsOnline = user?.friends.filter( element => {
        return element.online
    })

    //my public room is used only for informing my friends - never send messages to other public rooms(!)
    //my private room is used for receiving private messages from friends -  send msg other private rooms for 1-1-chat 

    //Create a public Room for ALL friends to join
    socket.join(`public-${userId}`)
    socket.join(`private-${userId}`)

    //Join friends public rooms && say Hi
    for (let i=0; i<friendsOnline?.length; i++){
        socket.join(`public-${friendsOnline[i]._id}`)
        socket.to(`private-${friendsOnline[i]._id}`).emit('register', userId)
    }   
    //Join your other Rooms for receiving news
    for (let i=0; i<user?.rooms.length; i++){
        socket.join(`room-${user.rooms[i].room}`)  
    }
    console.log(user?.username, ' got now online with friends: ', friendsOnline,' and joined the following rooms: ', socket.rooms)
    // io.emit('welcome', {"message": 'you are now online and somebody else maybe'});
}


//If friend got online add him
export const handshake = async(socket, friend) => {
    socket.join(`public-${friend}`)
    socket.to(`private-${friend}`).emit('welcome', `welcome back ${friend}`)
}



//If you logout inform other users
export const unRegisterUser = async(userId, socket) => {
    const user = await User.findByIdAndUpdate(userId,
        {
            socketId: null,
            online: false,
            roomOnline: null
        },
        {new: true})
    socket.to(`public-${userId}`).emit('unRegister', userId)
    socket.removeAllListeners()
    console.log('User logged out: ', user)
}