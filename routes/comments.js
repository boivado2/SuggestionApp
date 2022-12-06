const express = require("express");
const { Suggestion } = require('../models/suggestion')
const { Comment, validateComment } = require('../models/comment')
const { User } = require('../models/user');
const validateobjectIds = require("../middleware/validateobjectIds");
const auth = require("../middleware/auth");
const {getProfileImage} = require('../common/s3')





const router = express.Router()

router.get('/:id/comments', [validateobjectIds], async (req, res) => {
  const suggestion = await Suggestion.findById(req.params.id)
  if (!suggestion) return res.status(404).json({ error: "suggestion not found." })
  const comments = await Comment.find({ suggestionId: suggestion._id })

  for (let comment of comments) {
    getProfileImage(comment.user)
    await comment.save()
  }
  res.send(comments)
})



router.post('/:id/comments', [validateobjectIds, auth] ,async (req, res) => {


      const { error } = validateComment(req.body)
  if (error) return res.status(400).json({ error: error.message })
  
      if (req.body.parentId) {
        let comment = await Comment.findById(req.body.parentId)
        if (!comment) return res.status(400).json({ error: 'invalid comment' })
      }
  
      const suggestion = await Suggestion.findById(req.params.id)
      if (!suggestion) return res.status(404).json({error: "suggestion not found."})
      
      const user = await User.findById(req.user._id)
      if (!user) return res.status(400).json({ error: "user not login" })
      
      comment = new Comment({
        content: req.body.content,
        suggestionId: suggestion._id,
        parentId: req.body.parentId,
        replyingTo: req.body.replyingTo,
        user: {
          _id: user._id,
          image_url: user.image_url,
          username: user.username,
          name: user.name,
          image_name: user.image_name

        }
      })


  await comment.save()
  await suggestion.commentsLength++
  await suggestion.save()
  res.json(comment)
  
})


router.delete('/comments/:id', [validateobjectIds], async (req, res) => {
  
  const comment = await Comment.findByIdAndDelete({_id: req.params.id})
  if (!comment) return res.status(404).json({ error: "comment with the given id not found." })
  await Comment.deleteMany({parentId: req.params.id})

  res.send("deleted Succesfully")

})







module.exports = router