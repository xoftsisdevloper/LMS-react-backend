import express from 'express';
import { getAllSubjects, createSubject, updateSubject, deleteSubject } from '../controllers/subjectController.js';

const router = express.Router();

// GET all subjects
router.get('/', getAllSubjects);

// POST create a subject
router.post('/', createSubject);

// PUT update a subject
router.put('/:id', updateSubject);

// DELETE a subject
router.delete('/:id', deleteSubject);

export default router;
