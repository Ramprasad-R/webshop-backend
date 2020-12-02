import path from 'path'
import express from 'express'
// import asyncHandler from 'express-async-handler'

const router = express.Router()
const __dirname = path.resolve()

router.get('/template', (req, res) => {
  res.setHeader(
    'Content-disposition',
    'attachment; filename=ProductLoadTemplate.xlsx'
  )
  res.setHeader(
    'Content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.download(__dirname + '/assets/download/ProductLoadTemplate.xlsx')
})

export default router
