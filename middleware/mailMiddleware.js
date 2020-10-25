import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
// import fs from 'fs'

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

const MailGenerator = new Mailgen({
  theme: {
    theme: {
      path: path.resolve('assets/mailgen/template.html'),
    },
  },
  product: {
    name: 'Webshop',
    link: 'https://github.com/Ramprasad-R',
  },
})

const sendOrderEmail = (req, res, next) => {
  const { name, email } = req.user
  const { orderItems, taxPrice, shippingPrice, totalPrice } = req.body
  const mailOrderItem = orderItems.map(
    ({ product, image, countInStock, ...items }) => items
  )

  const response = {
    body: {
      name,
      intro: 'Please find your order details',
      table: {
        data: mailOrderItem,
        taxPrice,
        shippingPrice,
        totalPrice,
      },
      outro: 'Thank you for using WebShop',
    },
  }
  const mail = MailGenerator.generate(response)
  // fs.writeFileSync('preview.html', mail, 'utf8')
  const message = {
    from: process.env.ZOHO_EMAIL,
    to: email,
    subject: 'Order Summary - WebShop',
    html: mail,
  }

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('I came to error', error)
      res.status(406)
      throw new Error('Order not processed')
    } else {
      next()
    }
  })
}

export { sendOrderEmail }
