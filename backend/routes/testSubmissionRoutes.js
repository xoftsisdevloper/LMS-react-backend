import express from 'express';
import { getAllSubmissions, getSubmissionById, submitTest } from '../controllers/testSubmissionController.js';

const router = express.Router();

// Submit a test
router.post("/submit", submitTest);

// Get all submissions
router.get("/", getAllSubmissions);

// Get a specific submission by ID
router.get("/:id", getSubmissionById);

export default router;
