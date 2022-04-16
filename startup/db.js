const config = require('config')
const mongoose = require('mongoose')
const winston = require('winston')


module.exports = () => {
  let dbUrl = process.env.MONGO_URI || config.get('db')
  mongoose.connect(dbUrl).then(() => winston.log('info', "mogodb conneted succesfully"))

  
}