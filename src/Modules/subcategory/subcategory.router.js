import {Router} from "express" 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import * as subcategoryController from './controller/subcategory.controller.js'
import *as validator from './subcategory.validation.js'
import validation from "../../Middleware/validation.js"
import { auth } from "../../Middleware/auth.middleware.js"
import { endPoint } from "./subcategory.endpoint.js"
const router =Router({mergeParams: true})


router.post('/',auth(endPoint.create),fileUpload(fileValidation.image)
.single('image'),validation(validator.subCategoryCreate),
subcategoryController.createSubCategory)


router.put('/update/:subcategoryId',fileUpload(fileValidation.image).single('image'),validation(validator.subCategoryUpdate),subcategoryController.updateSubCategory)
router.get('/all',subcategoryController.getSubCategories)
router.get('/',subcategoryController.getSubCategory)
router.get('/:subcategoryId/products',subcategoryController.getProducts)

export default router