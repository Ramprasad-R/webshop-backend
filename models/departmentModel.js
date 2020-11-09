import mongoose from 'mongoose'

const categorySchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const departmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    department: {
      type: String,
      required: true,
      unique: true,
    },
    categories: [categorySchema],
  },
  {
    timestamps: true,
  }
)

const Department = mongoose.model('Department', departmentSchema)

export default Department
