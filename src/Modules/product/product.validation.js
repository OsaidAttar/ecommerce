import joi from 'joi'
import { generalFeilds } from '../../Middleware/validation.js'
export const brandyCreate=joi.object({
    name:joi.string().min(2).max(20).required(),
    file:generalFeilds.file.required(),
    categoryId:generalFeilds.id.required()  
}).required()
export const brandUpdate=joi.object({
    categoryId:generalFeilds.id,
    name:joi.string().min(2).max(20),
    file:generalFeilds.file
}).required()
export const getAllBrands=joi.object({
    categoryId:generalFeilds.id .required()  
}).required()