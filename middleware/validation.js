import {body, validationResult} from 'express-validator';
import createError from 'http-errors';

export const userValidationRules = () => {
    return [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Not a valid email'),
        //  body('password')
        //      .isStrongPassword({
        //          minLength: 5,
        //          minLowercase: 1,
        //          minUppercase: 1,
        //          minNumbers: 1,
        //      })
        //      .withMessage('you are a weak Gurke'),
        ]
}

export const userValidationErrorHandling = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next()

    const arrErrors = errors.array()
    const errorsSummary = mergeErrors(arrErrors)
    const err = new createError(422, errorsSummary)
    next(err)
}

const mergeErrors = arrErrors => arrErrors.map(err => `${err.msg}`).join(' ')