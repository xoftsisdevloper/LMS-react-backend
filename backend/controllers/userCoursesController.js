import User from "../models/userModel.js";

export const getUserCourses = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user and populate groups, courses, and subjects
    const user = await User.findById(userId).populate({
      path: 'groups',
      populate: {
        path: 'course_ids',
        populate: {
          path: 'subjects', // Ensure this is correctly referencing the Subject model
        }
      }
    }).exec();

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log user data for debugging
    console.log(JSON.stringify(user, null, 2)); // Check the structure here

    // Extract courses from populated data
    const userCourses = user.groups.flatMap(group => group.course_ids);

    return res.status(200).json({ data: userCourses });

  } catch (error) {
    console.error('Error fetching user courses:', error);
    return res.status(500).json({ error: 'Error fetching user courses' });
  }
};
