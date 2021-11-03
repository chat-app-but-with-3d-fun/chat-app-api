import express from 'express';
import cors from 'cors'
import {Server} from 'socket.io'
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import socketioJwt from 'socketio-jwt'
import jwt from 'jsonwebtoken';

import config from './config/config.js'
import userRoute from './routes/userRoute.js'
import msgRoute from './routes/messageRoute.js'
import roomRoute from './routes/roomRoute.js'
import {registerUser, unRegisterUser, handshake} from './socketFunc/handleRegister.js'
import { updateRoomStatus } from './socketFunc/handleStatusChange.js';
import {newMsg} from './socketFunc/handleMsg.js'

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
app.use(express.json())
app.use(cors({
  origin: config.frontendOrigin,
  credentials: true
}));
app.use(cookieParser());

//Routing
app.get('/', (req, res) => {
  res.send('Main Page')
})
app.use('/user', userRoute)
app.use('/room', roomRoute)
app.use('/msg', msgRoute)

//Start Server
const http = app.listen(PORT, () =>
  console.log(`listening on Port${PORT}`)
)

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
const newSocketConnection = async(socket, io) => {
  //For JWT Auth
   const userId = socket.decoded._id
  
  //No JWT Auth
  // const userId = socket.handshake.query.userId
  
  registerUser(userId, socket, io)
  
  
  //Event Llisteners
  socket.on('handshake', (friend) => handshake(socket, friend) )
  socket.on('updateRoomStatus', (friend) => updateRoomStatus(socket, userId, friend))
  socket.on('newMsg', (payload) => newMsg(socket, userId, payload))
  socket.on('statusMsg', (payload) => statusMsg(socket, userId, payload))
  socket.on('disconnect', () => {
    unRegisterUser(userId, socket)
  })
} 

//Starting Socket Server
const io = new Server(http, {cors: {origin: '*'}})


// Using no Authentication
// io.on('connection', (socket) => newSocketConnection(socket, io))

//Using JWT Authentication
 io.use( (socket, next) => {
   if (socket.handshake.query && socket.handshake.query.token){
     jwt.verify(socket.handshake.query.token, config.secretKey, function(err, decoded) {
       if (err) return next(new Error('Authentication error'));
       socket.decoded = decoded;
       console.log('WHAT HAPPENS HERE?: ',decoded)
       next();
     });
   }
   else {
     next(new Error('Authentication error'));
   }
 })
 .on('connection', (socket) => {
   newSocketConnection(socket, io)
 });