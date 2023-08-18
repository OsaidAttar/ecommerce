import  Mongoose ,{Schema,Types,model} from "mongoose";
const subCategorySchema=new Schema({
name:{type:String,required:true,unique:true},
slug:{type:String,required:true},
image:{type:Object,required:true},
categoryId:{type:Types.ObjectId,ref:'Category',required:true},
createdBy:{type:Types.ObjectId,ref:'User',required:true},
updatedBy:{type:Types.ObjectId,ref:'User',required:true},
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
subCategorySchema.virtual('products',{
localField:"_id",
foreignField:"subCategoryId",
ref:"Product"
})
const subCategoryModel=Mongoose.models.SubCategory ||model('SubCategory',subCategorySchema)
export default subCategoryModel
