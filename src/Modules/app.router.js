
import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import categoryRouter from './category/category.router.js';
import subCategoryRouter from './subcategory/subcategory.router.js';
import couponRouter from './coupon/coupon.router.js';
import brandRouter from './brand/brand.router.js';
import productRouter from './product/product.router.js';
import cartRouter from './cart/cart.router.js';
import orderRouter from './order/order.router.js';
import path from 'path'; 
import cors from 'cors'
import {fileURLToPath} from 'url';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const fullPath=path.join(__dirname,'../upload');

const initApp=(app,express)=>{
// app.use(async(req,res,next)=>{

//    var whitelist = ['https://silly-kheer-d485b2.netlify.app', 'http://localhost:3001']
//  if(!whitelist.includes(req.header('origin'))){
//    return next(new Error(`invalid origin`,{cause:403}))
//  }
//     next()
// })
app.use('/',(req,res)=>{
    return res.json('welcome')
})
   app.use(cors())
    connectDB();
    app.use(express.json());
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/category', categoryRouter);
    app.use('/subcategory', subCategoryRouter);
    app.use('/coupon', couponRouter);
    app.use('/brand', brandRouter);
    app.use('/product', productRouter);
    app.use('/cart', cartRouter);
    app.use('/order', orderRouter);
    app.use('/*', (req,res)=>{
        return res.json({messaga:"page not found"});
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;