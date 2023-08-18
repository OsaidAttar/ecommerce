import joi from 'joi'
import { generalFeilds } from '../../Middleware/validation.js'
export const categoryCreate=joi.object({
    name:joi.string().min(2).max(20).required(),
    file:generalFeilds.file.required()
}).required()
export const categoryUpdate=joi.object({
    categoryId:generalFeilds.id,
    name:joi.string().min(2).max(20),
    file:generalFeilds.file
}).required()
export const getCategory=joi.object({
    categoryId:generalFeilds.id   
}).required()