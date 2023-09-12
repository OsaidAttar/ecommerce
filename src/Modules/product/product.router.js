import {Router} from "express" 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import * as productController from './controller/product.controller.js'
import validation from "../../Middleware/validation.js"
import reviewRouter from '../review/review.router.js'
import { endPoint } from "./product.endpoint.js"
import { auth } from "../../Middleware/auth.middleware.js"
const router =Router({mergeParams:true})
router.use('/:productId/review',reviewRouter)
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).fields([
    {name:'mainImages',maxCount:1},
    {name:'subImages',maxCount:5}

]),
productController.createProduct)

router.put('/update/:productId',auth(endPoint.update),fileUpload(fileValidation.image).fields([
    {name:'mainImages',maxCount:1},
    {name:'subImages',maxCount:5}
]),productController.updateProduct)
router.patch('/softdelete/:productId',auth(endPoint.softdelete),productController.softDelete)
router.delete('/forcedelete/:productId',auth(endPoint.forcedelete),productController.forceDelete)
router.patch('/restore/:productId',auth(endPoint.restore),productController.restore)
router.get('/softdelete',auth(endPoint.get),productController.getSoftDeleteProducts)
router.get('/:productId',productController.getProduct)
router.get('/',productController.getProducts)
export default router