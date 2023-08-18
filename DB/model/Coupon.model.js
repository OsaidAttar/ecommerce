import  Mongoose ,{Schema,Types,model} from "mongoose";
const couponSchema=new Schema({
name:{type:String,required:true,unique:true},
amount:{type:Number,defualt :1},
expireDate:{type:String,required:true},
usedBy:[{type:Types.ObjectId,ref:"User"}],
createdBy:{type:Types.ObjectId,ref:'User',required:true},
updatedBy:{type:Types.ObjectId,ref:'User',required:true},
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
couponSchema.virtual('subcoupon',{
    localField:'_id',
    foreignField:'couponId',
    ref:'Subcoupon'

})
const couponModel=Mongoose.models.Coupon ||model('Coupon',couponSchema)
export default couponModel
