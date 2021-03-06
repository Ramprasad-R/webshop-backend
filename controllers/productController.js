import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1

  const { department, brand, keyword } = req.query
  let getProductBy
  if (department) {
    getProductBy = {
      department: {
        $regex: department,
        $options: 'i',
      },
    }
  } else if (brand) {
    getProductBy = {
      brand: {
        $regex: brand,
        $options: 'i',
      },
    }
  } else {
    getProductBy = keyword
      ? {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        }
      : {}
  }

  const count = await Product.countDocuments({ ...getProductBy })

  const products = await Product.find({ ...getProductBy })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    cost: 0,
    price: 0,
    promotionalPrice: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    department: 'Sample department',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
    dateOfExpiry: Date.now(),
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    barCode,
    price,
    description,
    image,
    brand,
    department,
    category,
    countInStock,
    promotionalPrice,
    dateOfExpiry,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.barCode = barCode
    product.price = price
    product.promotionalPrice = promotionalPrice
    product.description = description
    product.image = image
    product.brand = brand
    product.department = department
    product.category = category
    product.countInStock = countInStock
    product.dateOfExpiry = dateOfExpiry

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})

// @desc    Reduce Count In Stock once the order is placed
// @access  Private
const reduceCountInStock = asyncHandler(async (req, res, next) => {
  const { orderItems } = req.body
  if (orderItems) {
    orderItems.map(async (item) => {
      await Product.findByIdAndUpdate(item.product, {
        countInStock: item.countInStock - item.qty,
      })
    })
    next()
  } else {
    res.status(404)
    throw new Error('No order items')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  reduceCountInStock,
}
