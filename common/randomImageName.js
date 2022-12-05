const crypto = require('crypto')

module.exports =  (bytes= 16) => {
 return crypto.randomBytes(bytes).toString("hex")
}