const express = require("express");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const {User} = require('../models/user');


const router = express.Router()



router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)

  let user = await User.findOne({ username: req.body.username })
  if (!user) return res.status(400).send('invalid username or password.')
  
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('invalid username or password')
  
  const token = user.generateAuthToken()
  res.json(token)
})


const validate = (user) => {
  const schema =  Joi.object({
    username: Joi.string().min(3).max(225).required(),
    password: Joi.string().min(4).max(225).required(),    
  })
   
   return schema.validate(user)
 }

module.exports = router