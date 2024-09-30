// middlewares/validateCourse.js
import mongoose from 'mongoose';
import Subject from '../models/subjectModel.js';

const validateCourseCreation = async (req, res, next) => {
  const { name, description, duration, subject_ids } = req.body;

  // Validate the name
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'Name is required and must be a valid string' });
  }

  // Validate the description
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ message: 'Description is required and must be a valid string' });
  }

  // Validate the duration
  if (!duration || typeof duration !== 'number' || duration <= 0) {
    return res.status(400).json({ message: 'Duration must be a positive number' });
  }
  // Validate the subject_ids
  if (subject_ids && Array.isArray(subject_ids)) {
    for (const id of subject_ids) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: `Invalid Subject ID: ${id}` });
      }
    }

    // Check if all provided subject IDs exist in the database
    const foundSubjects = await Subject.find({ _id: { $in: subject_ids } });
    if (foundSubjects.length !== subject_ids.length) {
      return res.status(404).json({ message: 'One or more subject IDs are invalid or do not exist' });
    }
  } else {
    return res.status(400).json({ message: 'subject_ids must be an array of valid ObjectIds' });
  }

  // If validation passes, call the next middleware or controller
  next();
};

export default validateCourseCreation;
