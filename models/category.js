const mongoose = require('mongoose')
const Joi = require('joi')

const categorySchema = new mongoose.Schema({
  title: {type: String, minlength: 2, maxlength: 225, required: true},
})

const Category = mongoose.model('Category', categorySchema)



const validateCategory = (category) => {
 const schema =  Joi.object({
    title: Joi.string().min(2).max(225).required(),
 })
  
  return schema.validate(category)
}


exports.Category = Category
exports.validate = validateCategory
exports.categorySchema = categorySchema