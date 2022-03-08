const express = require("express");
const { Suggestion, validate } = require('../models/suggestion')
const { Category,  } = require('../models/category')
const { Status } = require('../models/status')



const router = express.Router()

router.get('/', async(req, res) => {
  const suggestions = await Suggestion.find().populate('status').populate('category')
  res.send(suggestions)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)

  const category = await Category.findById(req.body.categoryId)
  if(!category) return res.status(400).send("invalid category")

  // const status = await Status.findById(req.body.statusId)
  // console.log(req.body.statusId)
  // if(!status) return res.status(400).send("invalid status")


  
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
  const categoty = await Category.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true })
  
  if (!categoty) return res.status(404).send('category with the given Id not found')
  
  await categoty.save()
  res.send(categoty)
})


router.get('/:id', async (req, res) => {
  const categoty = await Category.findById(req.params.id)
  if (!categoty) return res.status(404).send('category with the given Id not found')

  res.send(categoty)
})


router.delete('/:id', async (req, res) => {

  const categoty = await Category.findByIdAndDelete(req.params.id)
  if (!categoty) return res.status(404).send('category with the given Id not found')

  res.send(categoty)
})

module.exports = router