import  Mongoose ,{Schema,Types,model} from "mongoose";
const productSchema=new Schema({
name:{type:String,required:true,unique:true,trim:true},
slug:{type:String,required:true},
description:{type:String},
stock:{type:Number,default:1},
price:{type:Number,default:1},
finalPrice:{type:Number,default:1},
discount:{type:Number,default:0},
colors:[String],
sizes:[{type:String,enum:['s','m','lg','xl']}],
mainImages:{type:Object,required:true},
subImages:{type:Object,required:true},
categoryId:{type:Types.ObjectId,ref:'Category',required:true},
subCategoryId:{type:Types.ObjectId,ref:'SubCategory',required:true},
brandId:{type:Types.ObjectId,ref:'Brand',required:true},
createdBy:{type:Types.ObjectId,ref:'User',required:true},
updatedBy:{type:Types.ObjectId,ref:'User',required:true},
deleted:{
    type:Boolean,
    default:false
}
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
productSchema.virtual('reviews',{
    localField:'_id',
    foreignField:'productId',
    ref:'Review'

})
const productModel=Mongoose.models.Product ||model('Product',productSchema)
export default productModel
