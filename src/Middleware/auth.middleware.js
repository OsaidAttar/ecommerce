import userModel from "../../DB/model/User.model.js"
import { asyncHandler } from "../Services/errorHandling.js"
import { verifyToken } from "../Services/generateAndVerifyToken.js"
export const roles= {
    Admin:'Admin',
    User:'User',  
}
export const auth =(accessRole=[])=>{
return asyncHandler( async(req,res,next)=>{
const {authorization}=req.headers
if(!authorization?.startsWith(process.env.BEARERKEY)){
return next(new Error('invalid bearar key',{cause:400}))
}
const token = authorization.split(process.env.BEARERKEY)[1]
if(!token){
    return next(new Error('invalid token',{cause:400}))
}
const decoded =verifyToken(token,process.env.LOGIN_TOKEN)
if(!decoded){
    return next(new Error('invalid token payload',{cause:400}))
}
const user= await userModel.findById(decoded.id).select('userName email role changePasswordTime')
if(!user){
    return next(new Error('not register user',{cause:403}))
}
if(!accessRole.includes(user.role)){
    return next(new Error('not authrized user',{cause:401}))
}
if(parseInt(user.changePasswordTime?.getTime()/1000)>decoded.iat){
return next (new Error('expired token',{cause:401}))
}


req.user=user
return next()
})
}