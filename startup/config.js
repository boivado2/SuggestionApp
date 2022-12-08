const config = require('config')

module.exports = () => {
  if (!process.env.JWT_TOKEN_KEY) {
    console.log("Fatal Error: no jwt key defined")
    process.exit(1)
  }
}