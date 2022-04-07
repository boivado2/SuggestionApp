const express = require("express");
const mongoose = require('mongoose')
const { Suggestion, validate } = require('../models/suggestion')
const { Category, } = require('../models/category')
const {User} = require('../models/user')
const validateobjectIds = require("../middleware/validateobjectIds");


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
    upvotes: req.body.upvotes,
    status:req.body.status,
    category: {
      _id: category._id,
      title: category.title
    }
  })

  await suggestion.save()
  res.json(suggestion)
})


router.put('/:id', validateobjectIds, async (req, res) => {

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


router.put('/:id/upvotes',async (req, res) => {
    const user = await User.findById(req.body.id)
  if (!user) return res.status(400).json('user not found')

  let suggestion = await Suggestion.findOne({ upvotes: { $in: user._id } })
  if (suggestion) {
    suggestion = await Suggestion.findOneAndUpdate({ _id: req.params.id }, { $pull: { upvotes: user._id } }, { new: true })
  } else {
    suggestion = await Suggestion.findByIdAndUpdate(req.params.id, { $push: { upvotes: user._id } }, { new: true })
  }

  if (!suggestion) return res.status(404).json("Suggestion not found")
  await suggestion.save()
  res.json(suggestion)
  
})


router.get('/:id', validateobjectIds, async (req, res) => {
  const suggestion = await Suggestion.findById(req.params.id)
  if (!suggestion) return res.status(404).send('suggestion not found')
  res.json(suggestion)
})


router.delete('/:id', validateobjectIds, async (req, res) => {

  const suggestion =  await Suggestion.findById(req.params.id)
  if (!suggestion) return res.status(404).send('suggestion not found')

  await Suggestion.deleteOne({_id: req.params.id})
    
  res.json('deleted Succesfully')
 
})







module.exports = router