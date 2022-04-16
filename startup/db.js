const config = require('config')
const mongoose = require('mongoose')
const winston = require('winston')


module.exports = () => {
  let dbUrl = config.get('db')
  if (process.env === 'production') {
    dbUrl = process.env.MONGO_URI
  }
  mongoose.connect(dbUrl).then(() => winston.log('info', "mogodb conneted succesfully"))
  
}