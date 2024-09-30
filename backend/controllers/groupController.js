import Group from '../models/groupModel.js';

export const getAllGroups = async (req, res) => {
  try {
    if (req.user.isAdmin == false) return res.status(500).json({error: "unauthenticated"});
    const groups = await Group.find()
    return res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching groups', details: error.message });
  }
};

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    const existingGroup = await Group.findOne({ name })

    if (existingGroup) {
      return res.status(400).json({ 
        error: 'Group already exists', 
        details: `A group with the name "${name}" already exists.` 
      });
    }

    const newGroup = new Group(req.body);
    await newGroup.save();
    return res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Error creating group', details: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    return res.status(200).json({ message: 'Group updated successfully', group });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Error updating group', details: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    return res.status(204).json({message: 'Group deleted successfully'}); 
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error deleting group', details: error.message });
  }
};
