const express = require("express");
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt')

const router = express.Router()

router.get('/', async(req, res) => {
  const users = await User.find()
  res.send(users)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)
  
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.email
  })


  // await user.save()
  res.send(user)
})


module.exports = router