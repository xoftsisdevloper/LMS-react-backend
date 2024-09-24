import Group from "../models/groupModel.js"

export const createGroup = async(req, res) => {
    const { name, description } = req.body
    try {
        const group = new Group({ name, description })
        await group.save()
        res.status(201).json({ message: 'Group created successfully', group })
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error })
    }
}

export const getAllGroups = async(req, res) => {
    try {
        const groups = await Group.find()
        res.json({ groups })
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving groups', error })
    }
}
