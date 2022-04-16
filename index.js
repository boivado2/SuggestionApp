
const express = require('express')

const app = express()

require('./startup/logger')()
require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/validation')()
require('./startup/prod')(app)


const port = process.env.PORT || 1200
const server = app.listen(port, () => console.log('Listenning on  ' + port))

module.exports = server

