import {Router} from "express" 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import * as brandController from './controller/brand.controller.js'
import *as validator from './brand.validation.js'
import validation from "../../Middleware/validation.js"
import { auth } from "../../Middleware/auth.middleware.js"
import { endPoint } from "./brand.endpoint.js"
const router =Router()

router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),validation(validator.brandyCreate),brandController.createBrand)
router.put('/update/:brandId',fileUpload(fileValidation.image).single('image'),validation(validator.brandUpdate),brandController.updateBrand)
router.get('/:categoryId',validation(validator.getAllBrands),brandController.getAllBrands)
export default router