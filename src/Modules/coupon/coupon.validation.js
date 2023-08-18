import joi from 'joi'
import { generalFeilds } from '../../Middleware/validation.js'
export const couponCreate=joi.object({
    name:joi.string().min(2).max(20).required(),
    amount:joi.number().positive().min(1).max(100).required(),
    expireDate:joi.required()
}).required()
export const couponUpdate=joi.object({
    couponId:generalFeilds.id,
    name:joi.string().min(2).max(20),
    amount:joi.number().positive().min(1).max(100),
  
}).required()
export const getCoupon=joi.object({
    couponId:generalFeilds.id   
}).required()