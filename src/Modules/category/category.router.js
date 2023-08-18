import {Router} from "express" 
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js"
import * as categoryController from './controller/category.controller.js'
import *as validator from './category.validation.js'
import subcategory from'../subcategory/subcategory.router.js'
import validation from "../../Middleware/validation.js"
import { auth, roles } from "../../Middleware/auth.middleware.js"
import { endPoint } from "../product/product.endpoint.js"
const router =Router()
router.use('/:categoryId/subcategory',subcategory)
router.post('/',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),validation(validator.categoryCreate),categoryController.createCategory)
router.put('/update/:categoryId',auth(endPoint.update),fileUpload(fileValidation.image).single('image'),validation(validator.categoryUpdate),categoryController.updateCategory)
router.get('/:categoryId',validation(validator.getCategory),categoryController.getCategory)
router.get('/',auth(Object.values(roles)),categoryController.getCategories)
router.delete('/forcedelete/:categoryId',auth(endPoint.forcedelete),categoryController.forceDelete)
export default router