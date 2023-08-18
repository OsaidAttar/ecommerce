import brandModel from "../../../../DB/model/Brand.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import slugify from'slugify'

export const getAllBrands =asyncHandler(async (req,res,next)=>{
    const {categoryId}=req.params
    const categories =(await brandModel.find({categoryId}))
    return res.status(201).json({message:"success",categories})
    })
export const createBrand =asyncHandler(async (req,res,next)=>{
const {name}=req.body
const {categoryId}=req.body
if(await brandModel.findOne({name})){
    
    return next(new Error(`Dublicate brand name ${name}`,{cause:409}))
}
const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/brand`})
const brand=await brandModel.create({name,slug:slugify(name),image:{secure_url,public_id},categoryId,createdBy:req.user._id,updatedBy:req.user._id})
return res.status(201).json({message:"success",brand})
})



export const updateBrand =asyncHandler(async (req,res,next)=>{
const brand =await brandModel.findById(req.params.brandId)
if(!brand){
    return next(new Error(`invalid brand id ${req.params.brandId}`,{cause:404}))
}
if(req.body.name){
    if(brand.name === req.body.name){
        return next(new Error(`old name match new name `,{cause:400}))
    }
    if(await brandModel.findOne({name:req.body.name})){
        return next(new Error(`Dublicate brand name `,{cause:409}))
    }
    brand.name=req.body.name
    brand.slug=slugify(req.body.name)

}
if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/brand`})
    await cloudinary.uploader.destroy(brand.image.public_id)
    brand.image={secure_url,public_id}
}
await brand.save()
return res.status(201).json({message:"success",brand})
})