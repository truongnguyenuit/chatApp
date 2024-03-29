const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = async (req, res, next) => {
  
  const authHeader =  req.header('Authorization')
  const token = authHeader && authHeader.split(' ')[1]
  if (!token)
    return res.status(401).json({
      success: false,
      message: 'Access token not found',
    })
  try {
    
    const decoded = jwt.verify(token, 'kjlwsehgkwolehgklwsednsdkgfvhoijlk')
    req.user = await User.findById(decoded.userId)
    
    next()

  } catch (error) {
    console.log(error)
    return res.status(403).json({ success: false, message: 'invalid token' })
  }
}

module.exports = verifyToken