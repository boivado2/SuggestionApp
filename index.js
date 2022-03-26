require('express-async-errors')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const error = require('./middleware/error')
const winston = require('winston')
const validateobjectIds = require('./middleware/validateobjectIds')
const cors = require('cors')

const app = express()


const dbUrl = config.get('db')
mongoose.connect(dbUrl).then(() => winston.log('info', "mogodb conneted succesfully"))

winston.add(new winston.transports.File({filename: 'exceptions.log', handleExceptions: true, handleRejections: true}),)



app.use(express.json())
app.use(cors())
app.use('/api/categories', require('./routes/categories'))
app.use('/api/suggestions', require('./routes/suggestions'))
app.use('/api/suggestions', require('./routes/comments'))
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use(error)



if (!config.get('feedPrivatekey')) {
  console.log("Fatal Error: no jwt key defined")
  process.exit(1)
}


app.get('/', (req, res) => {
  res.send('Suggestion App')
})

const port = process.env.PORT || 1200
const server = app.listen(port, () => console.log('Listenning on  ' + port))

module.exports = server