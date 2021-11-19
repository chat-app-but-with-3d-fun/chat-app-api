import {body, validationResult} from 'express-validator';

//Check if input is an Email
export const isEmail = () => {
    return(
        body('input')
            .trim()
            .isEmail()
    )}

//Construct search term depending if input is email or username    
export const prepareInput = (req, res, next) => {
    console.log('BODY: ',req.body)
    const errors = validationResult(req)
    const {input} = req.body
    if (errors.errors.length > 0) {
        req.search = {username: input}
    } else {
        req.search = {email: input}
    }
    next()
}