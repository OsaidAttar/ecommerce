import joi from 'joi'
import { generalFeilds } from '../../Middleware/validation.js'
export const createOrder=joi.object({
    phoneNumber:joi.string().required()
}).required()
