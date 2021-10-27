import express from 'express';
import cors from 'cors'
import {Server} from 'socket.io'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './config/config.js'

import userRoute from './routes/userRoute.js'
import msgRoute from './routes/messageRoute.js'
import roomRoute from './routes/roomRoute.js'

//mongoose Setup
mongoose
  .connect(config.mongooseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connection to DB established!!`))
  .catch((err) => {
    console.log(`We can not connect to the DB ->`, err);
  });



//Express Setup
const app = express()
const PORT = config.port

//Middleware
app.use( express.json())
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(cookieParser());

//Routing
app.get('/', (req, res) => {
    res.send('Main Page')
  })
app.use('/user', userRoute)
app.use('/room', roomRoute)
app.use('/msg', msgRoute)

//Start Server
const http = app.listen(PORT, () => {console.log(`listening on Port${PORT}`)})


//ERROR Handling
app.use(function errorHandler(err, req, res, next) {
    res.status(err.status || 400).send({
      error: {
        message: err.message,
        status: err.status,
      },
    });
  });


//Socket setup
const newSocketConnection = (socket) => {
  console.log('user connected', socket.id)  

  //Callback Functions
    const registerUser = async (data) => {
        const allUser = await io.fetchSockets() 
        const userArray = allUser.map(element => {
            return element.id
        })
        io.emit('handshake', userArray)
    } 

  //Event Llisteners
    socket.on('register', registerUser)
    socket.on('disconnect', () => {
        registerUser()
        socket.removeAllListeners()
    })
} 

//Starting Socket Server
const io = new Server(http,{cors: {origin: '*'}})

//Socket Server listening for connection 
io.on('connection', newSocketConnection)


