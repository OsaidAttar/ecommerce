import categoryModel from "../../../../DB/model/Category.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import slugify from'slugify'

export const getCategory =asyncHandler(async (req,res,next)=>{
const category =await categoryModel.findById(req.params.categoryId)
return res.status(201).json({message:"success",category})
})
export const getCategories =asyncHandler(async (req,res,next)=>{
    const categories =(await categoryModel.find().populate('subcategory'))
    return res.status(201).json({message:"success",categories})
    })
export const createCategory =asyncHandler(async (req,res,next)=>{

const name =req.body.name.toLowerCase()
if(await categoryModel.findOne({name})){
    
    return next(new Error(`Dublicate category name ${name}`,{cause:409}))
}
const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/category`})
const category=await categoryModel.create({name,slug:slugify(name),image:{secure_url,public_id},createdBy:req.user._id,updatedBy:req.user._id})
return res.status(201).json({message:"success",category})
})



export const updateCategory =asyncHandler(async (req,res,next)=>{
const category =await categoryModel.findById(req.params.categoryId)
if(!category){
    return next(new Error(`invalid category id ${req.params.categoryId}`,{cause:404}))
}
if(req.body.name){
    if(category.name === req.body.name){
        return next(new Error(`old name match new name `,{cause:400}))
    }
    if(await categoryModel.findOne({name:req.body.name})){
        return next(new Error(`Dublicate category name `,{cause:409}))
    }
    category.name=req.body.name
    category.slug=slugify(req.body.name)

}
if(req.file){
    const{secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.App_Name}/category`})
    await cloudinary.uploader.destroy(category.image.public_id)
    category.image={secure_url,public_id}
}
category.updatedBy=req.user._id
await category.save()
return res.status(201).json({message:"success",category})
})