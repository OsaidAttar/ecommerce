
import brandModel from "../../../../DB/model/Brand.model.js";

import productModel from "../../../../DB/model/Product.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import { asyncHandler } from "../../../Services/errorHandling.js";
import slugify from "slugify";

export const getAllBrands = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const categories = await brandModel.find({ categoryId });
  return res.status(201).json({ message: "success", categories });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;
  const checkCategory = await subCategoryModel.findOne({
    _id: subCategoryId,
    categoryId,
  });
  if (!checkCategory) {
    return next(new Error("invalid category or sub category"), { cause: 400 });
  }
  const checkBrand = await brandModel.findOne({ _id: brandId });
  if (!checkBrand) {
    return next(new Error("invalid brand"), { cause: 400 });
  }
  req.body.slug = slugify(name);
  req.body.finalPrice = price - price * ((discount || 0) / 100);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.mainImages[0].path,
    { folder: `${process.env.App_Name}/product` }
  );
  req.body.mainImages = { secure_url, public_id };
  if (req.files.subImages) {
    req.body.subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.App_Name}/product/subImages` }
      );
      req.body.subImages.push({ secure_url, public_id });
    }
  }
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  const product = await productModel.create(req.body);
  if (!product) {
    return next(new Error(`fail to create product `, { cause: 404 }));
  }
  return res.json({ message: "success", product });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { name, price, discount, categoryId, subCategoryId, brandId } =
    req.body;
  const newProduct = await productModel.findById(productId);
  if (!newProduct) {
    return next(new Error(`product not found`, { cause: 400 }));
  }
  if (categoryId && subCategoryId) {
    const checkSubCategory = await subCategoryModel.findById({
      _id: subCategoryId,
      categoryId,
    });
    if (checkSubCategory) {
      newProduct.subCategoryId = subCategoryId;
      newProduct.categoryId = categoryId;
    } else {
      return next(new Error(`invalid category or sub category`), {
        cause: 400,
      });
    }
  } else if (subCategoryId) {
    const checkSubCategory = await subCategoryModel.findOne({
      _id: subCategoryId,
    });
    if (checkSubCategory) {
      newProduct.subCategoryId = subCategoryId;
    } else {
      return next(new Error("invalid sub category"), { cause: 400 });
    }
  }
  if (brandId) {
    const checkBrand = await brandModel.findOne({ _id: brandId });
    if (!checkBrand) {
      return next(new Error("invalid brand"), { cause: 400 });
    } else {
      newProduct.brandId = brandId;
    }
  }
  if (name) {
    newProduct.name = name;
    newProduct.slug = slugify(name);
  }
  if (req.body.description) {
    newProduct.description = req.body.description;
  }
  if (req.body.stock) {
    newProduct.stock = req.body.stock;
  }
  if (req.body.colors) {
    newProduct.colors = req.body.colors;
  }
  if (req.body.sizes) {
    newProduct.sizes = req.body.sizes;
  }
  if (price && discount) {
    newProduct.price = price;
    newProduct.discount = discount;
    newProduct.finalPrice = price - price * ((discount || 0) / 100);
  } else if (price) {
    newProduct.price = price;
    newProduct.finalPrice = price - price * (newProduct.discount / 100);
  } else if (discount) {
    newProduct.discount = discount;
    newProduct.finalPrice =
      newProduct.price - newProduct.price * (discount / 100);
  }
  if (req.files.mainImages.length) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.files.mainImages[0].path,
      { folder: `${process.env.App_Name}/product` }
    );
    await cloudinary.uploader.destroy(newProduct.mainImages.public_id);
    newProduct.mainImages.public_id = public_id;
    newProduct.mainImages.secure_url = secure_url;
  }
  if (req.files.subImages.length) {
    const subImages = [];
    for (const file of req.files.subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `${process.env.App_Name}/product/subImages` }
      );
      subImages.push({ secure_url, public_id });
      //await cloudinary.uploader.destroy(newProduct.subImages.public_id)
    }
    newProduct.subImages = subImages;
  }
  newProduct.updatedBy = req.user._id;
  const product = await newProduct.save();
  if (!product) {
    return next(new Error(`fail to update product `, { cause: 404 }));
  }
  return res.json({ message: "success", product });
});
export const getProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId).populate("reviews");
  if (!product) {
    return next(new Error(`product not found `, { cause: 409 }));
  }
  return res.status(201).json({ message: "success", product });
});
export const getProducts = asyncHandler(async (req, res, next) => {
  let { page, size } = req.query;
  if (!page || page <= 0) {
    page = 1;
  }
  if (!size || size <= 0) {
    size = 3;
  }
  const skip = (page - 1) * size;
  const excQueryParams = ['page', 'size', 'sort', 'search'];
  const filterQuery={...req.query}
  excQueryParams.map(params=>{
delete filterQuery[params]
  })
  
  
  const quere =JSON.parse(JSON.stringify(filterQuery).replace(/(gt|gte|lt|lte|in|nin|eq|neq)/g,
  match => `$${match}`));
  const mongoQuery= productModel.find(quere).limit(size).skip(skip).sort(req.query.sort?.replaceAll(',',' '))
 
  if(req.query.search){
  const products=await mongoQuery.find({
$or:[
 { name:{$regex:req.query.search,$options:'i'},},
{  description:{$regex:req.query.search,$options:'i'}}
]
  })
  req.body.products=products

}
else{
  const products=await mongoQuery
  req.body.products=products
}
const products=req.body.products
  if (!products) {
    return next(new Error(`product not found `, { cause: 409 }));
  }

  return res.status(201).json({ message: "success", products });
});
export const softDelete = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  const product = await productModel.findByIdAndUpdate(
    { _id: productId, deleted: false },
    { deleted: true },
    { new: true }
  );
  if (!product) {
    return next(new Error(` product not found`, { cause: 404 }));
  }
  return res.json({ message: "success", product });
});
export const forceDelete = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  const product = await productModel.findByIdAndDelete({
    _id: productId,
    deleted: true,
  });
  if (!product) {
    return next(new Error(` product not found`, { cause: 404 }));
  }
  return res.json({ message: "success", product });
});

export const restore = asyncHandler(async (req, res, next) => {
  let { productId } = req.params;
  const product = await productModel.findByIdAndUpdate(
    { _id: productId, deleted: true },
    { deleted: false },
    { new: true }
  );
  if (!product) {
    return next(new Error(` product not found`, { cause: 404 }));
  }
  return res.json({ message: "success", product });
});

export const getSoftDeleteProducts = asyncHandler(async (req, res, next) => {
  const product = await productModel.find({ deleted: true });
  return res.json({ message: "success", product });
});
