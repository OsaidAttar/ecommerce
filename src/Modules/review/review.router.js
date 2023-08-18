import {Router} from "express" 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import * as reviewController from './controller/review.controller.js'
import *as validator from './review.validation.js'
import validation from "../../Middleware/validation.js"
import { auth } from "../../Middleware/auth.middleware.js"
import { endPoint } from "./controller/review.endpoint.js"
const router =Router({mergeParams:true})

router.post('/',auth(endPoint.create),reviewController.createReview)
router.put('/updateReview/:reviewId',auth(endPoint.update),reviewController.updateReview)
export default router