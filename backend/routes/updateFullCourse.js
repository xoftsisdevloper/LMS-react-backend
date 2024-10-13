import express from 'express';
import mongoose from 'mongoose';
import Course from '../models/courseModel.js';
import Subject from '../models/subjectModel.js';
import Material from '../models/meterialModel.js';


const router = express.Router();

router.put('/update-course/:courseId', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { courseId } = req.params;
    const courseData = req.body;

    // Step 1: Find the existing course
    const course = await Course.findById(courseId).session(session);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Step 2: Validate the incoming course data
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

    // Step 3: Update course basic information
    course.name = courseData.name;
    course.description = courseData.description;
    course.duration = courseData.duration;

    // Clear existing subject and material references
    const existingSubjects = await Subject.find({ course_id: course._id }).session(session);
    const existingSubjectIds = existingSubjects.map(subject => subject._id);

    // Step 5: Clear existing materials associated with the subjects
    await Material.deleteMany({ subject_id: { $in: existingSubjectIds } });

    // Step 6: Clear existing subject references from the course
    course.subjects = []; // Clear existing subject references

    // Step 7: Create or update subjects and materials
    for (let subjectData of courseData.subjects) {
      const materialIds = []; // Store material IDs for the subject

      // Create and save materials first
      for (let materialData of subjectData.materials) {
        const newMaterial = new Material({
          name: materialData.name,
          description: materialData.description,
          content_type: materialData.content_type,
          content_url: materialData.content_url,
        });

        await newMaterial.save({ session });
        materialIds.push(newMaterial._id); // Collect material IDs
      }

      // Create the subject with associated materials
      const newSubject = new Subject({
        name: subjectData.name,
        description: subjectData.description,
        course_id: course._id,
        materials: materialIds, // Attach the materials
        duration: subjectData.duration,
      });

      await newSubject.save({ session });
      course.subjects.push(newSubject._id); // Add subject to course
    }

    // Save the updated course with new subjects
    await course.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Course, subjects, and materials updated successfully',
      course: course,
    });

  } catch (error) {
    // Rollback the transaction in case of failure
    await session.abortTransaction();
    session.endSession();
    console.error('Error updating course:', error);

    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }

    res.status(500).json({ message: 'Failed to update course', error });
  }
});

export default router;
