import _ from 'lodash'
import asyncHandler from 'express-async-handler'
import Department from '../models/departmentModel.js'

//@desc   Get Department
//@route  GET /api/departments
//@access Public

const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({})
  res.status(200).json(departments)
})

//@desc   Create Department
//@route  POST /api/departments
//@access Private/Admin

const createDepartment = asyncHandler(async (req, res) => {
  const { department } = req.body
  if (department) {
    const addDepartment = new Department({
      user: req.user._id,
      department: department.replace(/\w+/g, _.capitalize),
    })
    const createdDepartment = await addDepartment.save()
    res.status(201).json(createdDepartment)
  } else {
    res.status(400)
    throw new Error('Department not created')
  }
})

// @desc    Create new Categories
// @route   POST /api/departments/:id/categories
// @access  Private/Admin

const createCategories = asyncHandler(async (req, res) => {
  const { category } = req.body

  const department = await Department.findById(req.params.id)

  if (department) {
    const categoryExist =
      department.categories.length > 0
        ? department.categories.filter(
            (category) => category.category === category
          )
        : null
    console.log(categoryExist)
    if (categoryExist.length > 0) {
      res.status(403)
      throw new Error('Category already exist')
    }

    const newCategory = {
      category,
      user: req.user._id,
    }

    department.categories.push(newCategory)

    await department.save()
    res.status(201).json({ message: 'Category added' })
  } else {
    res.status(404)
    throw new Error('Department not found')
  }
})

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)

  if (department) {
    await department.remove()
    res.json({ message: 'Department removed' })
  } else {
    res.status(404)
    throw new Error('Department not found')
  }
})

// @desc    Fetch single department
// @route   GET /api/departments/:id
// @access  Public
const getdepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)
  if (department) {
    res.json(department)
  } else {
    res.status(404)
    throw new Error('Department not found')
  }
})

// @desc    Delete a category
// @route   DELETE /api/departments/:id/categories
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id)
  const { categoryId } = req.body

  console.log(req.body, categoryId)
  if (department) {
    department.categories.pull(categoryId)
    await department.save()
    res.json({ message: 'Category removed' })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

export {
  getDepartments,
  createDepartment,
  createCategories,
  deleteDepartment,
  getdepartmentById,
  deleteCategory,
}
