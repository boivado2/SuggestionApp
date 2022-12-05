const express = require("express");
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt');
const router = express.Router()
const _ = require('lodash')
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() })
const randomImageName = require('../common/randomImageName')
const { postProfileImage } = require('../common/s3')


router.get('/', async(req, res) => {
  const users = await User.find()
  res.json(users)
})

router.post('/', upload.single('profile_image'), async (req, res) => {
  const imageName = randomImageName()
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)

  let user = await User.findOne({ username: req.body.username })
  if (user) return res.status(400).send('Username already taken!')
  
  
  postProfileImage(req.file, imageName )

  user = new User({
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    image_name : imageName
  })

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()

  const token = user.generateAuthToken()
  res.header('x-auth-token', token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user,['_id', "name", "username", "image_name", "image_url"]))

})


module.exports = router