const config = require('config')
const jsonwebtoken = require('jsonwebtoken');
module.exports  =  (req, res, next) => {
  const token = req.header('x-auth-token')
  if (!token)  return res.status(401).json('Access denied, no token provided')
  try {
    const decoded = jsonwebtoken.verify(token, config.get('feedPrivatekey'))
    req.user = decoded
    next()

  } catch (ex) {
    return res.status(400).json("invalid token")
    
  }

}