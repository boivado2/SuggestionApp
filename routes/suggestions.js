const express = require("express");
const mongoose = require('mongoose')
const { Suggestion, validate } = require('../models/suggestion')
const { Category, } = require('../models/category')
const {User} = require('../models/user')
const validateobjectIds = require("../middleware/validateobjectIds");
const auth = require("../middleware/auth");


const router = express.Router()

router.get('/', async(req, res) => {
  const suggestions = await Suggestion.find()
  res.json(suggestions)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const category = await Category.findById(req.body.categoryId)
  if (!category) return res.status(400).json({ error: "ivalid category." })

  
  const suggestion = new Suggestion({
    title: req.body.title,
    description: req.body.description,
    category: {
      _id: category._id,
      title: category.title
    }
  })

  await suggestion.save()
  res.json(suggestion)
})


router.put('/:id', [validateobjectIds,auth], async (req, res) => {

  const { error } = validate(req.body)
  if (error) return res.status(400).json({ error: error.message })

  const category = await Category.findById(req.body.categoryId)
  if (!category) return res.status(400).json({ error: 'ivalid category' })

  const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    upvotes: req.body.upvotes,
    status: req.body.status,
    category: {
      _id: category._id,
      title: category.title
    }
  }
  , { new: true })
  
 
  if (!suggestion) return res.status(404).send('suggestion  not found.')
  await suggestion.save()
  res.json(suggestion)
})


router.patch('/:id', [validateobjectIds, auth], async (req, res) => {
    const user = await User.findById(req.user._id)
  if (!user) return res.status(400).json('user not found')

  let suggestion = await Suggestion.findOne({ _id: req.params.id, upvotes: { $in: user._id } })
  if (!suggestion) {
    suggestion = await Suggestion.findOneAndUpdate({ _id: req.params.id }, { $push: { upvotes: user._id } }, { new: true })
  } else {
    suggestion = await Suggestion.findOneAndUpdate({ _id: req.params.id }, { $pull: { upvotes: user._id } }, {new:true})
  }

  if (!suggestion) return res.status(404).json("Suggestion not found")
  await suggestion.save()
  res.json(suggestion)
  
})

// get a single suggestion
router.get('/:id', validateobjectIds, async (req, res) => {
  const suggestion = await Suggestion.findById(req.params.id)
  if (!suggestion) return res.status(404).send('suggestion not found')
  res.json(suggestion)
})

// get all suggestions like by a user
router.get("/:id/upvotes", [validateobjectIds, auth], async (req, res) => {
  const suggestions = await Suggestion.find({ upvotes: { $in: req.user._id } })
  if(!suggestions) return res.status(400).json("found nothing.")
  res.send(suggestions)
  
})


router.delete('/:id', [validateobjectIds,auth], async (req, res) => {

  const suggestion =  await Suggestion.findById(req.params.id)
  if (!suggestion) return res.status(404).send('suggestion not found')

  await Suggestion.deleteOne({_id: req.params.id})
    
  res.json('deleted Succesfully')
 
})



module.exports = router