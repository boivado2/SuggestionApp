const mongoose = require('mongoose')
const Joi = require('joi')
const  { Comment } =  require('./comment')
const {categorySchema} = require('./category')


const suggestionSchema = new mongoose.Schema({
  title: {type: String, minlength: 4, maxlength: 225, required: true},
  upvotes: {type: Number, min:0, max:100000, default:0},
  description: {type: String, minlength: 6, maxlength: 1000, required: true},
  category: {type:categorySchema, required:true },
  status: { type: String, default: 'Suggestion' },
})


suggestionSchema.pre("deleteOne",function (next)  {
  const { _id } = this.getQuery()
  Comment.deleteMany({  _id }, next)
})

const Suggestion = mongoose.model('Suggestion', suggestionSchema)



const validateSuggestion = (suggestion) => {
 const schema =  Joi.object({
    title: Joi.string().min(3).max(225).required(),
    upvotes: Joi.number().min(0).max(100000),
    description: Joi.string().min(6).max(1500).required(),
    categoryId: Joi.objectId(),
    status: Joi.string().min(3).max(100),
 })
  
  return schema.validate(suggestion)
}


exports.Suggestion = Suggestion
exports.validate = validateSuggestion