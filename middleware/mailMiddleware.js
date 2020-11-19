import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import nodemailer from 'nodemailer'
import ejs from 'ejs'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const __dirname = path.resolve()

const senderEmail = process.env.ZOHO_EMAIL
const senderPassword = process.env.ZOHO_PASSWORD

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true, //ssl,
  auth: {
    user: `${senderEmail}`,
    pass: `${senderPassword}`,
  },
})

const welcomeEmail = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  ejs.renderFile(
    __dirname + '/assets/template/welcome.ejs',
    { name, email, password },
    function (err, data) {
      if (err) {
        res.status(500)
        throw new Error('Internal error, contact site admin')
      } else {
        var mainOptions = {
          from: process.env.ZOHO_EMAIL,
          to: email,
          subject: 'Welcome to Cauvery Stores - Account Activated',
          html: data,
        }

        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            res.status(400)
            throw new Error('Invalid user data')
          } else {
            next()
          }
        })
      }
    }
  )
})

const sendOrderEmail = asyncHandler(async (req, res) => {
  const { name, email } = req.user
  const {
    _id,
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.createdOrder
  const mailOrderItem = orderItems.map(
    ({ product, image, countInStock, ...items }) => items
  )
  ejs.renderFile(
    __dirname + '/assets/template/orderDetails.ejs',
    {
      _id,
      name,
      email,
      mailOrderItem,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress,
      itemsPrice,
      orderItems,
    },
    function (err, data) {
      if (err) {
        res.status(400)
        throw new Error(
          'Your Order is placed, contact Cauvery Stores if you did not get the order email'
        )
      } else {
        var mainOptions = {
          from: process.env.ZOHO_EMAIL,
          to: email,
          subject: `Your Cauvery Store order # ${_id}`,
          html: data,
        }

        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            res.status(400)
            throw new Error(
              'Your Order is placed, contact Cauvery Stores if you did not get the order email'
            )
          } else {
            res.status(201).json(req.createdOrder)
          }
        })
      }
    }
  )
})

export { welcomeEmail, sendOrderEmail }
