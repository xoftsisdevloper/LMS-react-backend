import express from 'express';
import { getAllCourses, createCourse, updateCourse, deleteCourse, getCourseDetails, submitUserRating, getRating, updateCourseProgress, getCourseProgress } from '../controllers/courseController.js';
import validateCourseCreation from '../middleware/validateCourse.js';

const router = express.Router();

// GET all courses
router.get('/', getAllCourses);

// POST create a course
router.post('/', validateCourseCreation,createCourse);

// PUT update a course
router.put('/:id', updateCourse);

// DELETE a course
router.delete('/:id', deleteCourse);

router.get('/:id', getCourseDetails);

router.post('/:id/rate', submitUserRating);

router.get('/:id/ratings', getRating);

router.get('/:id/progress', getCourseProgress);

router.put('/:id/progress', updateCourseProgress);

export default router;
