import createError from 'http-errors';
import User from '../models/User.js';
import Room from '../models/Room.js'
import bcryptjs from 'bcryptjs';
import config from '../config/config.js'


//First Draft stopped working here
export const createRoom = async (req, res, next) => {
    const {id: userId}  = req.params
    const {roomName='noName', users=[]} = req.body
    users.push(userId)
    
    try{
        const data = {roomName, users}
        const room = await Room.create(data);
        res.send(room)
        }
    catch(error){
      next(error)
    }
}