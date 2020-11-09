import _ from 'lodash'
import asyncHandler from 'express-async-handler'
import Brand from '../models/brandModel.js'

//@desc   Get Brand
//@route  GET /api/brands
//@access Public

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({})
  res.json(brands)
})

//@desc   Create Department
//@route  POST /api/brands
//@access Private/Admin

const createBrand = asyncHandler(async (req, res) => {
  const { brandName } = req.body
  if (brandName) {
    const addBrand = new Brand({
      user: req.user._id,
      brandName: brandName.replace(/\w+/g, _.capitalize),
    })
    const createdBrand = await addBrand.save()
    res.status(201).json(createdBrand)
  } else {
    res.status(400)
    throw new Error('Brand Name cannot be empty')
  }
})

export { getBrands, createBrand }
