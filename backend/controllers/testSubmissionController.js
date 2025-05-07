import TestSubmission from "../models/testSubmission.js";
// Import the function
import {updateLeaderboard} from "./leaderBoardController.js"
// Submit Test and Update Leaderboard
export const submitTest = async (req, res) => {
  try {
    const { user, test, subject, lesson, score, correct_answers, wrong_answers, skipped_questions, average_score, submitted_at, total_questions, detailed_answers } = req.body;

    const submission = await TestSubmission.create({
      user,
      test,
      subject,
      lesson,
      score,
      correct_answers,
      wrong_answers,
      skipped_questions,
      average_score,
      submitted_at,
      total_questions,
      detailed_answers,
    });

    // 🔥 Automatically update leaderboard after submission
    await updateLeaderboard(
      test,
      subject,
      lesson,
      user,
      score,
    );

    res.status(201).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// (Optional) Get all submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await TestSubmission.find().populate('user test subject lesson');
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// (Optional) Get single submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const submission = await TestSubmission.findById(req.params.id).populate('user test subject lesson');
    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }
    res.status(200).json({ success: true, data: submission });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubmissionsByTestId = async (req, res) => {
  try {
    const submissions = await TestSubmission.find({ test: req.params.testId }).populate('user test subject lesson');
    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ success: false, message: "No submissions found for this test" });
    }
    res.status(200).json({ success: true, data: submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
