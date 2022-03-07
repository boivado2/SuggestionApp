const mongoose = require('mongoose')
const Joi = require('joi')

const categorySchema = new mongoose.Schema({
  title: {type: String, minlength: 4, maxlength: 225, required: true},
})

const Category = mongoose.model('category', categorySchema)



const validateCategory = () => {
  Joi.object({
    title: Joi.string().min(3).max(225).required(),
  })
}


exports.Category = Category
exports.validate = validateCategory
exports.categorySchema = categorySchema