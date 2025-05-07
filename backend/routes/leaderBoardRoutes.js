import express from "express";
import { getLeaderboard, getLeaderboardForTest } from "../controllers/leaderBoardController.js";

const router = express.Router();

// Get full leaderboard with query params
router.get("/", getLeaderboard);

// Get leaderboard for specific test
router.get("/test/:testId", getLeaderboardForTest);

export default router;
