import express from 'express';
import { getAllGroups, createGroup, updateGroup, deleteGroup } from '../controllers/groupController.js';

const router = express.Router();

// GET all groups
router.get('/', getAllGroups);

// POST create a group
router.post('/', createGroup);

// PUT update a group
router.put('/:id', updateGroup);

// DELETE a group
router.delete('/:id', deleteGroup);

export default router;
