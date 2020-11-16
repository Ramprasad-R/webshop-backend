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
      brandName: brandName,
    })
    const createdBrand = await addBrand.save()
    res.status(201).json(createdBrand)
  } else {
    res.status(400)
    throw new Error('Brand Name cannot be empty')
  }
})

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if (brand) {
    await brand.remove()
    res.json({ message: 'Brand removed' })
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

export { getBrands, createBrand, deleteBrand }
