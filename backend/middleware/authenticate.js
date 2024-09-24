import User from "../models/userModel.js"
import jwt from "jsonwebtoken"

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json({ message: 'Unauthorized' })
    }
    
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)

    if(!decoded){
        return res.status(401).json({ message: 'Invalid Token' })
    }

    const user = await User.findById(decoded.id)
    if(!user){
        return res.status(404).json({ message: 'User not found' })
    }
    
    req.user = user

    next()
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error })
  }
}

export default authenticate
