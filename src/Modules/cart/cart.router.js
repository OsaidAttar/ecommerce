import {Router} from "express" 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import * as cartController from './controller/cart.controller.js'
import *as validator from './cart.validation.js'
import validation from "../../Middleware/validation.js"
import { auth } from "../../Middleware/auth.middleware.js"
import { endPoint } from "./cart.endpoint.js"
const router =Router()
router.post('/',auth(endPoint.create),cartController.addProductToCart)
router.patch('/deleteitem',auth(endPoint.create),cartController.deleteItem)
router.patch('/clearcart',auth(endPoint.create),cartController.clearCart)
router.get('/',auth(endPoint.create),cartController.getCart)
export default router