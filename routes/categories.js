const express = require("express");
const {Category, validate} = require('../models/category')

const router = express.Router()

router.get('/', async(req, res) => {
  const categories = await Category.find()
  res.send(categories)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)
  
  const category = new Category({
    title: req.body.title
  })

  await category.save()
  res.send(category)
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