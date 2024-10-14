// controllers/courseController.js
import mongoose from 'mongoose';
import Course from '../models/courseModel.js';
import Material from '../models/meterialModel.js';
import Subject from '../models/subjectModel.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: 'subjects',
      populate: {
        path: 'materials',
        model: 'Material'
      }
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching courses', details: error.message });
  }
};

// Create a course
export const createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ message: 'Course created successfully', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating course', details: error.message });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error updating course', details: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction to ensure atomicity

  try {
    // Step 1: Find the course and associated subjects
    const course = await Course.findById(req.params.id).populate('subjects').session(session);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Step 2: Extract subject IDs from the course
    const subjectIds = course.subjects.map(subject => subject._id);

    // Step 3: Delete associated materials for each subject
    await Material.deleteMany({ subject_id: { $in: subjectIds } }).session(session);

    // Step 4: Delete associated subjects
    await Subject.deleteMany({ _id: { $in: subjectIds } }).session(session);

    // Step 5: Delete the course itself
    await Course.findByIdAndDelete(req.params.id).session(session);

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession();

    res.status(204).send(); // Successfully deleted, no content to return

  } catch (error) {
    // Abort the transaction in case of failure
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).json({ error: 'Error deleting course', details: error.message });
  }
};


// Get details of a specific course
export const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'subjects',
      populate: {
        path: 'materials',
        model: 'Material'
      }
    });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Submit a user rating for the course
export const submitUserRating = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    course.ratings.push({
      user: req.user.id,
      rating,
      comment
    });

    await course.save();

    return res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
}

// Get average rating for the course
export const getRating = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const ratings = course.ratings;
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / totalRatings
      : 0;

    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get user progress for a course
export const getCourseProgress = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('progress.user');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userProgress = course.progress.find(p => p.user._id.toString() === req.user.id);
    if (!userProgress) {
      return res.status(404).json({ message: 'Progress not found for the user in this course' });
    }

    res.json({ progress: userProgress.progress, completedMaterials: userProgress.completedMaterials });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update user progress for a course
export const updateCourseProgress = async (req, res) => {
  try {
    const { materialId } = req.body;
    const courseId = req.params.id;

    const course = await Course.findById(courseId).populate('materials');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const userProgress = course.progress.find(p => p.user.toString() === req.user.id);
    
    // If user progress doesn't exist, create it
    if (!userProgress) {
      const newProgress = {
        user: req.user.id,
        completedMaterials: [materialId],
        progress: (1 / course.materials.length) * 100
      };
      course.progress.push(newProgress);
    } else {
      // If user progress exists, update it
      if (!userProgress.completedMaterials.includes(materialId)) {
        userProgress.completedMaterials.push(materialId);
        userProgress.progress = (userProgress.completedMaterials.length / course.materials.length) * 100;
      }
    }

    await course.save();
    res.status(200).json({ message: 'Progress updated successfully', progress: userProgress.progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}