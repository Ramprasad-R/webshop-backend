import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('demo', 10),
    isAdmin: true,
  },
  {
    name: 'Ram',
    email: 'ram@example.com',
    password: bcrypt.hashSync('demo', 10),
  },
  {
    name: 'Prasad',
    email: 'prasad@example.com',
    password: bcrypt.hashSync('demo', 10),
  },
]

export default users
