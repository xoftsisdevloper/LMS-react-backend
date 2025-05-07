import express from "express";
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  getTestByType,
  updateTestStatus
} from "../controllers/testController.js"; // <-- Note the .js extension if using ES Modules

const router = express.Router();

// Create a new test
router.post("/", createTest);

// Get all tests
router.get("/", getAllTests);

// Get a single test by ID
router.get("/:id", getTestById);

// Update a test
router.put("/:id", updateTest);

// Delete a test
router.delete("/:id", deleteTest);

// Get tests by type (pre-test or post-test)
router.get("/type/:type", getTestByType);

// update test status
router.put("/test-status/:id", updateTestStatus)

export default router;
