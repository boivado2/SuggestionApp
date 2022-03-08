const mongoose = require('mongoose')
const Joi = require('joi')
const { categorySchema } = require('./category')
const {statusSchema} = require('./status')


const suggestionSchema = new mongoose.Schema({
  title: {type: String, minlength: 4, maxlength: 225, required: true},
  upvotes: {type: Number, min:0, max:100000, required: true},
  description: {type: String, minlength: 6, maxlength: 1000, required: true},
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  status: {type: mongoose.Schema.Types.ObjectId, ref: 'Status'},
})

const Suggestion = mongoose.model('Suggestion', suggestionSchema)



const validateSuggestion = (suggestion) => {
 const schema =  Joi.object({
    title: Joi.string().min(3).max(225).required(),
    upvotes: Joi.number().min(0).max(100000).required(),
    description: Joi.string().min(6).max(1500).required(),
    categoryId: Joi.objectId(),
    statusId: Joi.objectId(),
 })
  
  return schema.validate(suggestion)
}


exports.Suggestion = Suggestion
exports.validate = validateSuggestion