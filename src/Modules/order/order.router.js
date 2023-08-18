import {Router} from "express" 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import * as orderController from './controller/order.controller.js'
import *as validator from './order.validation.js'
import validation from "../../Middleware/validation.js"
import { auth, roles } from "../../Middleware/auth.middleware.js"
import { endPoint } from "./order.endpoint.js"

const router =Router()
router.post('/',auth(endPoint.create),orderController.createOrder)
router.post('/allItemFromCart',auth(endPoint.create),orderController.createOrderWithAllItemFromCart)
router.patch('/cancel/:orderId',auth(endPoint.cancel),orderController.cancelOrder)
router.patch('/changestatusfromadmin/:orderId',auth(endPoint.updateOrderStatusFromAdmin),orderController.updateOrderStatusFromAdmin)
export default router