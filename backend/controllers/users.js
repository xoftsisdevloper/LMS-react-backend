import bcrypt from 'bcrypt'
import generatedTokenAndCookie from '../utils/tokenGenerator.js'
import mongoose from 'mongoose'
import User from '../models/userModel.js'
import Group from '../models/groupModel.js'

export const saveUsers = async(req, res)=>  {
   
    try{
        const data = {
            users: [{username: 'John Doe', email: 'john@example.com'}, {username: 'Jane Doe', email: 'jane@example.com'}]
        }

        const savedUsers = await Promise.all(data.users.map(userData => {
        const user = new User(userData)
        return user.save()
    }))
    res.status(201).json(savedUsers)
    console.log(savedUsers)
    }catch(error){
        res.status(500).json({message: error.message})
     }
}

export const getUsers = async(req, res) => {
    try {
        const users = await User.find({})
        res.json(users)
        console.log(req.user)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
}

export const signUpUser = async (req, res) => {
    try {
        const {username, password, confirmPassword, isAdmin, groupId} = req.body

        let group = null
        if (!isAdmin) {
            group = await Group.findById(groupId)
            if (!group) {
                return res.status(404).json({ message: 'Group not found' })
            }
        }

        // confirm passowrd mismatch
        if(password!==confirmPassword){
            return res.status(400).json({message: 'Passwords do not match'})
        }

    // user already exists
    const user = await User.findOne({username})
    if(user){
        return res.status(400).json({message: 'User already exists'})
    }


    // hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({username, password: hashedPassword, isAdmin, group: isAdmin ? null : groupId})
    newUser.save()

    const populatedUser = await User.findById(newUser._id).populate('group')

    if(newUser){
        generatedTokenAndCookie(newUser, res)
        return res.status(201).json({message: 'User created successfully', populatedUser}
        )
    }

    } catch (error) {
        return res.status(500).json({message: 'Failed to create user', error})
    }
}

export const signInUser = async (req, res) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if(!user){
            return res.status(401).json({message: 'User not found'})
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({message: 'Incorrect password'})
        }

        generatedTokenAndCookie(user, res)
        return res.status(200).json({message: 'User logged in successfully'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Failed to login user'})
    }
}

export const signOutUser = async (req, res) => {
    try {
        res.clearCookie('jwt')
        return res.status(200).json({message: 'User logged out successfully'})
    } catch (error) {
        res.status(500).json(error)
    }
}

export const destroyAll = async (req, res) => {

    try {
        if(await User.deleteMany({})){
            return res.status(200).json({message: 'All users deleted'})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Failed to delete users'})
    }
}

export const destroyByUserNameOrId = async (req, res) => {

    try {
        const id = req.params.id
        let user

        if(mongoose.Types.ObjectId.isValid(id)){
             user = await User.findById(id)
        }

         user = await User.findOne({username: id})

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if(await User.deleteOne({_id: user._id})){
            return res.status(200).json({ message: 'User deleted successfully' })
        }

    } catch (error) {
        res.status(404).json({ error: error})
        console.log(error)
        console.table([error.message])
    }
}