import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import { asyncHandler } from "../../../Services/errorHandling.js";

export const createReview =asyncHandler(async (req,res,next)=>{
const {productId}=req.params
const {comment,rating}=req.body
const order=await orderModel.findOne({
    userId: req.user._id,
    status:'delivered',
    'products.productId':productId
})
if(!order){
    return next(new Error(`cant review product before receive it`,{cause:404}))
}
const checkReview=await reviewModel.findOne({createdBy:req.user._id,productId})
if(checkReview){
    return next(new Error(`already review by you`,{cause:400}))
}
const review=await reviewModel.create({
    createdBy:req.user._id,
    orderId:order._Id,
    productId,
    comment,
    rating
})
return res.status(201).json({message:"success",review})
})



export const updateReview =asyncHandler(async (req,res,next)=>{
const{productId,reviewId}=req.params
const review =await reviewModel.findByIdAndUpdate({_id:reviewId,productId,createdBy:req.user._id},req.body,{new:true})
return res.status(201).json({message:"success",review})
})