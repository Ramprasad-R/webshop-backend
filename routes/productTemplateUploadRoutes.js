import path from 'path'
import fs from 'fs'
import express from 'express'
import multer from 'multer'
import xlsxToJson from 'xlsx-to-json'
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import { admin, protect } from '../middleware/authMiddleware.js'
const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'productTemplate/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({
  storage,
  fileFilter: function (req, file, callback) {
    //file filter
    if (
      ['xls', 'xlsx'].indexOf(
        file.originalname.split('.')[file.originalname.split('.').length - 1]
      ) === -1
    ) {
      return callback(new Error('Wrong extension type'))
    }
    callback(null, true)
  },
}).single('file')

router.post(
  '/',
  protect,
  admin,
  upload,
  asyncHandler(async (req, res) => {
    xlsxToJson(
      {
        input: `${req.file.path}`,
        output: 'productTemplate/output.json',
        sheet: 'Sheet1',
      },
      async (err, result) => {
        if (err) {
          console.error(err)
        } else {
          // console.log(result)
          const sampleProducts = result.map((product) => {
            return { ...product, user: req.user._id }
          })

          await Product.insertMany(sampleProducts)

          console.log('Data Imported'.green.inverse)
          fs.unlinkSync(req.file.path)
          fs.unlinkSync('productTemplate/output.json')

          res.send({ message: 'Product Imported' })
        }
      }
    )
  })
)

export default router
