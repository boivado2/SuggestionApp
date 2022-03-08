const express = require("express");
const { Suggestion, validate } = require('../models/suggestion')
const { Category,  } = require('../models/category')



const router = express.Router()

router.get('/', async(req, res) => {
  const suggestions = await Suggestion.find().populate('category')
  res.send(suggestions)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)

  const category = await Category.findById(req.body.categoryId)
  if(!category) return res.status(400).send("invalid category")

  
  const suggestion = new Suggestion({
    title: req.body.title,
    description: req.body.description,
    upvotes: req.body.upvotes,
    status:req.body.status,
    category: category._id
  })

  await suggestion.save()
  res.send(suggestion)
})


router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)
  const category = await Category.findById(req.body.categoryId)
  if (!category) return res.status(404).send('ivalid category')

  const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    description: req.body.description,
    upvotes: req.body.upvotes,
    status: req.body.status,
    category: category._id
  }
  , { new: true })
  
 
  if (!suggestion) return res.status(400).send('suggestion with the given id not found.')
  await suggestion.save()
  res.send(suggestion)
})


router.get('/:id', async (req, res) => {
  const suggestion = await Suggestion.findById(req.params.id).populate('category')
  if (!suggestion) return res.status(404).send('category with the given Id not found')

  res.send(suggestion)
})


router.delete('/:id', async (req, res) => {

  const suggestion = await Suggestion.findByIdAndDelete(req.params.id)
  if (!suggestion) return res.status(404).send('category with the given Id not found')

  res.send(suggestion)
})

module.exports = router