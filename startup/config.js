const config = require('config')


module.exports = () => {
  if (!config.get('feedPrivatekey')) {
    console.log("Fatal Error: no jwt key defined")
    process.exit(1)
  }
}