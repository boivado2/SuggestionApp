const Joi = require("joi")
const mongoose = require("mongoose")



const url = "https://i.stack.imgur.com/34AD2.jpg"

const replySchema = new mongoose.Schema({
  content: { type: String, minlength: 3, maxlength: 225, required: true, trim :true },
  replyingTo: { type: String, minlength: 4, maxlength: 50 },
  commentId: {type: mongoose.Schema.Types.ObjectId, ref: "Reply", required:true},
  user: {
    type :new mongoose.Schema({
      image_url: { type: String, default: url, minlength: 4, maxlength: 1125, required: true },
      username: { type: String, minlength: 4, maxlength: 225, required: true },
      email: { type: String, minlength: 5, maxlength: 1125, required: true,  },
    }),
    required:true
  },
})

replySchema.pre('deleteOne', function (next) {
  const { commentId, replyId } = this.getQuery()
 Comment.findByIdAndUpdate(commentId,
    {
      $pull : { replies : {_id: replyId}}
    }, (err) => {
      next(err)
    }
  )
})


const Reply = mongoose.model('Reply', replySchema)


const validateReply = (reply) => {
  const schema =  Joi.object({
     content: Joi.string().min(3).max(225).required(),
    userId: Joi.objectId(),
     commentId: Joi.objectId()
  })
   
   return schema.validate(reply)
 }



 exports.Reply = Reply

exports.validateReply = validateReply

const {Comment} = require('./comment')
