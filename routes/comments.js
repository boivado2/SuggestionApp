const express = require("express");
const { Suggestion } = require('../models/suggestion')
const { Comment, validateComment } = require('../models/comment')
const { Reply, validateReply } = require('../models/reply')
const {User} = require('../models/user');
const { default: mongoose } = require("mongoose");




const router = express.Router()

router.get('/comments/:id', async(req, res) => {
  const comments = await Comment.find({suggestionId: req.params.id})
  res.send(comments)
})



router.post('/comments/:id', async (req, res) => {
  const session = await mongoose.startSession()

  const { error } = validateComment(req.body)
  if (error) return res.status(400).send(error.message)
  
     await session.withTransaction(async () => {
      const suggestion = await Suggestion.findById(req.params.id).session(session)
      if (!suggestion) return res.status(400).send("invalid suggestion")
      
      const user = await User.findById(req.body.userId)
      if(!user) return res.status(400).send("invalid User")
      
      const comment = new Comment({
        content: req.body.content,
        suggestionId : suggestion._id,
        user: {
          _id: user._id,
          image_url: user._image_url,
          username: user.username,
          email: user.email
        }
      }, { session : session })

      await comment.save({session})

      await suggestion.comments.push(comment)
   
     await suggestion.save()
      res.send(comment)

 })
  
     session.endSession()

  



})


router.delete('/comments/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id)
  if (!comment) return res.status(404).send("comment with the given id not found.")
  
  const suggestion =   await Suggestion.findByIdAndUpdate(
      comment.suggestionId, {
        $pull : {comments: req.params.id}
  })
  if (!suggestion) return res.status(400).send("invalid Suggestion")
  
  await Comment.deleteMany({_id: req.params.id})

  res.send("deleted Succesfully")

})







module.exports = router