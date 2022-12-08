const mongoose = require('mongoose')
const Joi = require('joi')
const jsonwebtoken = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
  username: { type: String, minlength: 3, maxlength: 225, required: true, unique: true },
  name: { type: String, minlength: 5, maxlength: 1125, required: true },
  password: { type: String, minlength: 4, maxlength: 10000, required: true },
  image_url: { type: String },
  image_name: {type : String , required: true }
})


userSchema.methods.generateAuthToken = function() {
 return jsonwebtoken.sign({_id: this._id}, process.env.JWT_TOKEN_KEY)
}

const User = mongoose.model('User', userSchema)

const validateUser = (user) => {
 const schema =  Joi.object({
   username: Joi.string().min(3).max(225).required(),
   name: Joi.string().min(5).max(225).required(),
   password: Joi.string().min(4).max(225).required(),
 })
  
  return schema.validate(user)
}


exports.User = User
exports.validate = validateUser
exports.userSchema = userSchema
