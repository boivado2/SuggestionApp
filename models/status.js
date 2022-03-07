const mongoose = require('mongoose')
const Joi = require('joi')

const statusSchema = new mongoose.Schema({
  title: {type: String, minlength: 4, maxlength: 225, required: true},
})

const Status = mongoose.model('Status', statusSchema)



const validateStatus = () => {
  Joi.object({
    title: Joi.string().min(3).max(225).required(),
  })
}


exports.Status = Status
exports.validate = validateStatus
exports.statusSchema = statusSchema