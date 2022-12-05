const mongoose = require('mongoose')
const Joi = require('joi')


const commentSchema = new mongoose.Schema({
  content: { type: String, minlength: 4, maxlength: 225, required: true },
  suggestionId: { type: mongoose.Schema.Types.ObjectId, ref: "Suggestion" },
  parentId: { type: mongoose.Schema.Types.ObjectId },
  replyingTo: {type: String},
  user: {
   type:new mongoose.Schema({
      image_url: { type: String, required: true },
      username: { type: String, minlength: 4, maxlength: 225, required: true },
      name: { type: String, minlength: 5, maxlength: 1125, required: true }
   }),
    required:true
  },
 
 
})



const Comment = mongoose.model('Comment', commentSchema)



const validateComment = (comment) => {
 const schema =  Joi.object({
    content: Joi.string().min(3).max(225).required(),
   suggestionId: Joi.objectId(),
   parentId : Joi.objectId(),
   replyingTo: Joi.string()
 })
  
  return schema.validate(comment)
}


exports.Comment = Comment
exports.validateComment = validateComment


