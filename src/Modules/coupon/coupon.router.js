import {Router} from "express" 
import * as couponController from './controller/coupon.controller.js'
import *as validator from './coupon.validation.js'
import validation from "../../Middleware/validation.js"
import { auth } from "../../Middleware/auth.middleware.js"
import { endPoint } from "./coupon.endpoint.js"
const router =Router()

router.post('/',auth(endPoint.create),validation(validator.couponCreate),couponController.createCoupon)
router.get('/',couponController.getCoupons)
router.put('/update/:couponId',validation(validator.couponUpdate),couponController.updateCoupon)
router.get('/:couponId',validation(validator.getCoupon),couponController.getCoupon)

export default router