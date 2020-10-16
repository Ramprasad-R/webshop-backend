import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import colors from 'colors'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

connectDB()

const app = express()

app.use(express.json())

const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('API Server Running...')
})

app.use('/api/products', productRoutes)

app.use('/api/users', userRoutes)

app.use('/api/orders', orderRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.use(notFound)
app.use(errorHandler)

app.listen(
  port,
  console.log(`Server started and running on port ${port}`.yellow.bold)
)
