import path from 'path'
import express from 'express'
import multer from 'multer'
import asyncHandler from 'express-async-handler'
import cloudinary from '../config/cloudinary.js'
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router.post(
  '/',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    // res.send(`/${req.file.path}`)
    try {
      const result = await cloudinary.uploader.upload(req.file.path)
      res.send(result.secure_url)
    } catch (error) {
      throw new Error('Error uploading image')
    }
  })
)

export default router
