import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/courseModel.js';
import Subject from '../models/subjectModel.js';
import Material from '../models/meterialModel.js';

const router = express.Router();

// API endpoint to create a course with subjects and materials in a single transaction
router.post('/create-course', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const courseData = req.body;  // Extract courseData directly from the request body

    // Step 1: Validation
    if (!courseData.name || !courseData.description || !courseData.duration) {
      return res.status(400).json({ message: 'Course name, description, and duration are required.' });
    }

    if (!Array.isArray(courseData.subjects) || courseData.subjects.length === 0) {
      return res.status(400).json({ message: 'At least one subject is required.' });
    }

    // Validate each subject and its materials
    for (const subject of courseData.subjects) {
      if (!subject.name || !subject.description || !subject.duration) {
        return res.status(400).json({ message: 'Each subject must have a name, description, and duration.' });
      }

      if (!Array.isArray(subject.materials) || subject.materials.length === 0) {
        return res.status(400).json({ message: 'Each subject must have at least one material.' });
      }

      for (const material of subject.materials) {
        if (!material.name || !material.content_type || !material.content_url) {
          return res.status(400).json({ message: 'Each material must have a name, content type, and content URL.' });
        }
      }
    }

    // Step 2: Create the course
    const newCourse = new Course({
      name: courseData.name,
      description: courseData.description,
      duration: courseData.duration,
      subjects: [], // Will populate after subjects creation
    });

    await newCourse.save({ session });

    // Step 3: Create each subject and its materials
    for (let subjectData of courseData.subjects) {
      const materialIds = [];

      for (let materialData of subjectData.materials) {
        const newMaterial = new Material({
          name: materialData.name,
          description: materialData.description,
          content_type: materialData.content_type,
          subject_id: newCourse._id, // Temporary assignment, will update later
          content_url: materialData.content_url,
        });

        await newMaterial.save({ session });
        materialIds.push(newMaterial._id); // Collect material ids
      }

      // Create the subject with associated materials
      const newSubject = new Subject({
        name: subjectData.name,
        description: subjectData.description,
        course_id: newCourse._id,
        materials: materialIds, // Attach the materials
        duration: subjectData.duration,
      });

      await newSubject.save({ session });
      newCourse.subjects.push(newSubject._id); // Add subject to course
    }

    // Save the updated course with subjects
    await newCourse.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Course, subjects, and materials created successfully',
      course: newCourse,
    });

  } catch (error) {
    // Rollback the transaction in case of failure
    await session.abortTransaction();
    session.endSession();

    // Log the error details
    console.error('Error creating course:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }

    res.status(500).json({ message: 'Failed to create course', error });
  }
});

export default router;
