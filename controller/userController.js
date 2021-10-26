import createError from 'http-errors';
import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import config from '../config/config.js'


//ADDING a new user
export const addUser = async (req, res, next) => {
    const info = req.body;
    try {
      const user = await User.create(info);
      user.password = undefined;
      const token = user.generateAuthToken();

      
      res
      .cookie('token', token, {
        expires: new Date(Date.now() + 172800000),
        sameSite: config.ckSameSite,
        secure: config.ckSecure, 
        httpOnly: true,
      })
        .send(user);
    } catch (err) {
      next(err);
    }
  };

  //LOGIN
  export const loginUser = async (req, res, next) => {
    console.log('LOGIN REQUESTED: ', req.body)  
    try {
      const {username, password} = req.body;
        const user = await User.findOne( {username})
        if (!user) throw new createError(404, `Username not valid`);
        
        const passwordIsValid = bcryptjs.compareSync(password, user.password);
        if(!passwordIsValid) next(createError(404, `Password is not valid`));
        const token = user.generateAuthToken();

        
        res
          .cookie('token', token, {
            expires: new Date(Date.now() + 172800000),
            sameSite: config.ckSameSite,
            secure: config.ckSecure, 
            httpOnly: true,
          })
          .send(user);
    }  catch(error){
        next(error)
        }
    }; 

  //FIND User using an id inside req.body 
    export const findUser = async(req, res, next) => {
      const id = req.body
      try{
       const user = await User.findOne(id).select('username email')
       res.send(user)
      } catch(error) {
        next(error)
      }
    }


    //VERIFYING Cookie, is it working??
    export const verifyCookie = (req, res) => {
      res.send(req.user);
    };


    //LOGOUT
    export const logout = (req, res) => {
      res.clearCookie("token")
      res.json({ message: "Logged you out successfully" })
    }