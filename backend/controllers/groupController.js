import Group from '../models/groupModel.js';

export const getAllGroups = async (req, res) => {
  try {
    // if (req.user.isAdmin == false) return res.status(500).json({error: "unauthenticated"});
    const groups = await Group.find()
    return res.status(200).json({data: groups});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching groups', details: error.message });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }
    return res.status(200).json({data: group});
} catch (error) {
    return res.status(500).json({ message: 'Error fetching group', error });
}
}

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

export const assignGroupsToUsers = async (req, res) => {
  const { groupId } = req.params;
  const { userIds } = req.body;
  
  try {
      const group = await Group.findById(groupId);
      if (!group) {
          return res.status(404).json({ message: 'Group not found' });
      }
      
      const uniqueUserIds = Array.from(new Set([...group.users, ...userIds]));
      
      group.users = uniqueUserIds;
      await group.save();
      
      return res.status(200).json(group);
  } catch (error) {
      return res.status(400).json({ message: error.message });
  }
}

export const assignGroupsToCourse = async (req, res) => {
  const { groupId } = req.params;
  const { courseIds } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.courses.includes(courseId)) {
        group.courses.push(courseIds);
        await group.save();
        return res.status(200).json(group);
    }

    return res.status(400).json({ message: 'Course already assigned to group' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export const getUserCourses = async(req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ users: userId }).populate('courses');
    let courses = [];
    groups.forEach(group => {
        courses = courses.concat(group.courses);
    });

    const uniqueCourses = [...new Set(courses)];

    return res.status(200).json({data: uniqueCourses });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching courses for user', error });
  }
}