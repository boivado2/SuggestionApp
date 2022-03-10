const mongoose = require('mongoose')
const Joi = require('joi')

const replySchema = new mongoose.Schema({
  title: { type: String, minlength: 4, maxlength: 225, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
})

const commentSchema = new mongoose.Schema({
  title: { type: String, minlength: 4, maxlength: 225, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required:true },
  reply: [{type:replySchema}]
 
})

const Comment = mongoose.model('Comment', commentSchema)



const validateComment = (comment) => {
 const schema =  Joi.object({
    title: Joi.string().min(3).max(225).required(),
   userId: Joi.objectId().required()
 })
  
  return schema.validate(comment)
}


exports.Comment = Comment
exports.validateComment = validateComment