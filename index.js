import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import downloadRoutes from './routes/downloadRoutes.js'
import departmentRoutes from './routes/departmentRoutes.js'
import brandRoutes from './routes/brandRoutes.js'
import productTemplateUploadRoutes from './routes/productTemplateUploadRoutes.js'

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('API Server Running...')
})

app.use('/api/products', productRoutes)

app.use('/api/users', userRoutes)

app.use('/api/orders', orderRoutes)

app.use('/api/upload', uploadRoutes)

app.use('/api/products/upload', productTemplateUploadRoutes)

app.use('/api/download', downloadRoutes)

app.use('/api/departments', departmentRoutes)

app.use('/api/brands', brandRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.use(notFound)
app.use(errorHandler)

app.listen(
  port,
  console.log(`Server started and running on port ${port}`.yellow.bold)
)
