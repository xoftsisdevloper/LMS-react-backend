import express from 'express';
import { getAllGroups, createGroup, updateGroup, deleteGroup, assignGroupsToUsers, assignGroupsToCourse, getGroupById, getUserCourses } from '../controllers/groupController.js';

const router = express.Router();

// GET all groups
router.get('/', getAllGroups);

router.get('/:id', getGroupById);

// POST create a group
router.post('/', createGroup);

// PUT update a group
router.put('/:id', updateGroup);

// DELETE a group
router.delete('/:id', deleteGroup);

router.post(':groupId/users', assignGroupsToUsers)

router.post(':groupId/courses', assignGroupsToCourse)

router.get('/:userId/courses', getUserCourses)

export default router;
