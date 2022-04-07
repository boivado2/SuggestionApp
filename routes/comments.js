const express = require("express");
const { Suggestion } = require('../models/suggestion')
const { Comment, validateComment } = require('../models/comment')
const {User} = require('../models/user');




const router = express.Router()

router.get('/:id/comments', async(req, res) => {
  const comments = await Comment.find({suggestionId: req.params.id})
  res.send(comments)
})



router.post('/:id/comments', async (req, res) => {

      const { error } = validateComment(req.body)
      if (error) return res.status(400).json({ error: error.message })
      
      if (req.body.parentId) {
        let comment = await Comment.findById(req.body.parentId)
        if (!comment) return res.status(400).json({ error: 'invalid comment' })
      }
  
  
      const suggestion = await Suggestion.findById(req.params.id)
      if (!suggestion) return res.status(404).json({error: "suggestion not found."})
      
      const user = await User.findById(req.body.userId)
      if(!user) return res.status(400).json({error: "user not found"})
      
      comment = new Comment({
        content: req.body.content,
        suggestionId: suggestion._id,
        parentId: req.body.parentId,
        replyingTo: req.body.replyingTo,
        user: {
          _id: user._id,
          image_url: user._image_url,
          username: user.username,
          name: user.name
        }
      })

  await comment.save()
  await suggestion.commentsLength++
  await suggestion.save()
      res.json(comment)


})


router.delete('/comments/:id', async (req, res) => {
  
  const comment = await Comment.findByIdAndDelete({_id: req.params.id})
  if (!comment) return res.status(404).json({ error: "comment with the given id not found." })
  await Comment.deleteMany({parentId: req.params.id})

  res.send("deleted Succesfully")

})







module.exports = router