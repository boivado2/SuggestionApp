const express = require("express");
const { Suggestion } = require('../models/suggestion')
const { Comment, validate } = require('../models/comment')
const {User} = require('../models/user')



const router = express.Router()

// router.get('/', async(req, res) => {
//   const categories = await Category.find()
//   res.send(categories)
// })

router.post('/:id/comment', async (req, res) => {
  const session = await mongoose.startSession()

  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)

  const suggestion = await Suggestion.findById(req.params.id).session(session)
  if (!suggestion) return res.status(404).send("Suggestion not found")
  
  const user = await User.findById(req.body.userId)
  if(!user) return res.status(400).send("invalid User")
  
  const comment = new Comment({
    title: req.body.title,
    user: {
      _id: user._id,
      image_url: user._image_url,
      username: user.username,
      email: user.email
    }
  },{session: session})


  try {
    await session.withTransaction(async () => {
      await comment.save()

      await suggestion.comments.push(comment)
      
      res.send(comment)

 })
     session.endSession()
  } catch (ex) {
    console.log(ex)
  }



})






module.exports = router