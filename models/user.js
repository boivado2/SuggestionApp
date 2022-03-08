const mongoose = require('mongoose')
const Joi = require('joi')
const jsonwebtoken = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
  username: { type: String, minlength: 4, maxlength: 225, required: true },
  email: { type: String, minlength: 5, maxlength: 1125, required: true, unique: true },
  password: { type: String, minlength: 4, maxlength: 10000, required: true },  
})


userSchema.methods.generateAuthToken = function() {
 return jsonwebtoken.sign({_id: this._id}, config.get('feedPrivatekey'))
}

const User = mongoose.model('User', userSchema)

const validateUser = (user) => {
 const schema =  Joi.object({
   username: Joi.string().min(4).max(225).required(),
   email: Joi.string().min(5).max(225).required().email(),
   password: Joi.string().min(4).max(225).required(),

   
 })
  
  return schema.validate(user)
}


exports.User = User
exports.validate = validateUser
exports.userSchema = userSchema