import express from 'express';
import { getAllCourses, createCourse, updateCourse, deleteCourse, getCourseDetails, submitUserRating, getRating, updateCourseProgress, getCourseProgress, getCoursesByType, getCourseByJoinCode, requestCourseJoin, getJoinRequestsForCourse, handleJoinRequest, getAllJoinRequests } from '../controllers/courseController.js';
import validateCourseCreation from '../middleware/validateCourse.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// GET all courses
router.get('/', getAllCourses);

// POST create a course
router.post('/', validateCourseCreation, createCourse);

// PUT update a course
router.put('/:id', updateCourse);

// DELETE a course
router.delete('/:id', deleteCourse);

router.get('/:id', getCourseDetails);

router.post('/:id/rate', authenticate, submitUserRating);

router.get('/:id/ratings', getRating);

router.get('/:id/progress', getCourseProgress);

router.put('/:id/progress', updateCourseProgress);

router.get('/type/:type', getCoursesByType);

router.get('/join/:joinCode', getCourseByJoinCode);

router.post('/request-join', authenticate, requestCourseJoin);

router.get('/:userId/join-requests', authenticate, getJoinRequestsForCourse);

router.post('/handle-join-request', authenticate, handleJoinRequest);

router.get('/all/Requests', getAllJoinRequests);

export default router;
