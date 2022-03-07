const express = require("express");
const {Status, validate} = require('../models/status')

const router = express.Router()

router.get('/', async(req, res) => {
  const status = await Status.find()
  res.send(status)
})

router.post('/', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)
  
  const status = new Status({
    title: req.body.title
  })

  await status.save()
  res.send(status)
})


router.put('/:id', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.message)
  const status = await Status.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true })
  
  if (!status) return res.status(404).send('Status with the given Id not found')
  
  await status.save()
  res.send(status)
})


router.get('/:id', async (req, res) => {
  const status = await Status.findById(req.params.id)
  if (!status) return res.status(404).send('status with the given Id not found')

  res.send(status)
})


router.delete('/:id', async (req, res) => {

  const status = await Status.findByIdAndDelete(req.params.id)
  if (!status) return res.status(404).send('status with the given Id not found')

  res.send(status)
})

module.exports = router