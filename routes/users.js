const express = require("express");
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt');
const router = express.Router()
const _ = require('lodash')
router.get('/', async(req, res) => {
  const users = await User.find()
  res.json(users)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)

  let user = await User.findOne({ username: req.body.username })
  if(user) return res.status(400).send('Username already taken!')
  
  user = new User({
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    image_url: req.body.image_url
  })

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()
  res.header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user,['_id', "name", "username", "image_url"]))

})


module.exports = router