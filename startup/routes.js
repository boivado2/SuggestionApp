const cors = require('cors')
const error = require('../middleware/error')
const express = require('express')

module.exports = (app) => {

  app.use(express.json())
  app.use(cors())
  app.use('/api/categories', require('../routes/categories'))
  app.use('/api/suggestions', require('../routes/suggestions'))
  app.use('/api/suggestions', require('../routes/comments'))
  app.use('/api/users', require('../routes/users'))
  app.use('/api/auth', require('../routes/auth'))
  app.use(error)
  
}