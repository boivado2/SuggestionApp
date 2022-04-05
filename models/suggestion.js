const mongoose = require('mongoose')
const Joi = require('joi')
const  { Comment } =  require('./comment')
const {categorySchema} = require('./category')


const suggestionSchema = new mongoose.Schema({
  title: {type: String, minlength: 4, maxlength: 225, required: true},
  upvotes: [
    {type: mongoose.Schema.Types.ObjectId}
  ],
  description: {type: String, minlength: 6, maxlength: 1000, required: true},
  category: {type:categorySchema, required:true },
  status: { type: String, default: 'Suggestion' },
  commentsLength: {type: Number, default: 0}
})


suggestionSchema.pre("deleteOne",function (next)  {
  const { _id } = this.getQuery()
  Comment.deleteMany({ suggestionId:  _id }, next)
})

const Suggestion = mongoose.model('Suggestion', suggestionSchema)



const validateSuggestion = (suggestion) => {
 const schema =  Joi.object({
    title: Joi.string().min(3).max(225).required(),
    upvotes: Joi.array(),
    description: Joi.string().min(6).max(1500).required(),
    categoryId: Joi.objectId(),
   status: Joi.string().min(3).max(100),
    commentsLength: Joi.number()
 })
  
  return schema.validate(suggestion)
}


exports.Suggestion = Suggestion
exports.validate = validateSuggestion