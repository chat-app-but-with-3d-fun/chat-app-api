// import createError from 'http-errors';
// import User from '../models/User.js';


// export const checkMembershipFunc = async(userId, roomId) => {
//     try {
//         const user = await User.findById(userId)
//         if (user.rooms?.includes(roomid)){
//             return true
//         }
//         else return false
//     }
//     catch(error){
//         console.log('ERROR membershipFunc', error)
//         return false
//     }
// }


// export const checkMembership = async(req, res. next) => {
//     const {id: userId, roomId}  = req.params
//     try{
//         const checkPassed = await checkMembership(userId, roomId)
//         if (!checkPassed)
//         next(
//            createError(401, `You have no permission for this action`)
//         );
//         next();
//     } catch (err) {
//         next(err);
//     }
// }