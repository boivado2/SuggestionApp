const express = require("express");
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt');

const router = express.Router()

router.get('/', async(req, res) => {
  const users = await User.find()
  res.send(users)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)

  let user = await User.findOne({ email: req.body.email })
  if(user) return res.status(400).send('User already exist')
  
  
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()
  res.header('x-auth-token', token).send(user)

})


module.exports = router