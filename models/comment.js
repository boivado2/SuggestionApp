const mongoose = require('mongoose')
const Joi = require('joi')

const url = "https://i.stack.imgur.com/34AD2.jpg"




const commentSchema = new mongoose.Schema({
  content: { type: String, minlength: 4, maxlength: 225, required: true },
  suggestionId : {type : mongoose.Schema.Types.ObjectId, ref:"Suggestion"},
  user: {
   type:new mongoose.Schema({
      image_url: { type: String, default: url, minlength: 4, maxlength: 1125, required: true },
      username: { type: String, minlength: 4, maxlength: 225, required: true },
      email: { type: String, minlength: 5, maxlength: 1125, required: true }
   }),
    required:true
  },
  replies: [{
    type: new mongoose.Schema({
      content: { type: String, minlength: 4, maxlength: 225, required: true },
      replyingTo: {type: String, minlength: 4, maxlength: 50},
      user: {
      type :new mongoose.Schema({
        image_url: { type: String, default: url, minlength: 4, maxlength: 1125, required: true },
        username: { type: String, minlength: 4, maxlength: 225, required: true },
        email: { type: String, minlength: 5, maxlength: 1125, required: true },
      }),
      required:true
    },
    }),
  }],



 
})

commentSchema.pre('deleteMany', function (next) {
  const commentId = this.getQuery()._id
  Reply.deleteMany({commentId}, next)
})

const Comment = mongoose.model('Comment', commentSchema)



const validateComment = (comment) => {
 const schema =  Joi.object({
    content: Joi.string().min(3).max(225).required(),
   userId: Joi.objectId(),
   suggestion: Joi.objectId()
 })
  
  return schema.validate(comment)
}


exports.Comment = Comment
exports.validateComment = validateComment


const { Reply } = require('./reply')
