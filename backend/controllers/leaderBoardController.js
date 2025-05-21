import Leaderboard from "../models/leaderBoardModel.js";

// 🛠️ Create or Update Leaderboard Entry
export const updateLeaderboard = async (testId, subjectId, lessonId, userId, score) => {
  try {
    let leaderboard = await Leaderboard.findOne({ test: testId, subject: subjectId, lesson: lessonId });

    if (!leaderboard) {
      leaderboard = new Leaderboard({ test: testId, subject: subjectId, lesson: lessonId, rankings: [] });
    }

    // Check if user already exists in rankings
    const userIndex = leaderboard.rankings.findIndex(r => r.user.toString() === userId.toString());

    if (userIndex !== -1) {
      // Update score if the new score is higher
      
      leaderboard.rankings[userIndex].score = score;
      leaderboard.rankings[userIndex].time_submitted = new Date();
    } else {
      // Add new user to rankings
      leaderboard.rankings.push({
        user: userId,
        score: score,
        time_submitted: new Date(),
      });
    }

    // Sort rankings by score (desc), then by earliest submission time
    leaderboard.rankings.sort((a, b) => {
      if (b.score === a.score) {
        return new Date(a.time_submitted) - new Date(b.time_submitted);
      }
      return b.score - a.score;
    });

    // Update ranks based on sorted rankings
    leaderboard.rankings.forEach((r, index) => {
      r.rank = index + 1;
    });

    // Update best_score to the highest score in rankings
    leaderboard.best_score = leaderboard.rankings.length > 0 ? leaderboard.rankings[0].score : 0;

    await leaderboard.save();
    return leaderboard;

  } catch (err) {
    console.error("Error updating leaderboard:", err.message);
    throw err;
  }
};

// 🧩 Controller: GET Full Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { testId, subjectId, lessonId } = req.query;

    const query = {};
    if (testId) query.test = testId;
    if (subjectId) query.subject = subjectId;
    if (lessonId) query.lesson = lessonId;

    const leaderboard = await Leaderboard.findOne(query)
      .populate("rankings.user", "username email") // populate user info
      .populate("test", "test_name")
      .populate("subject", "title")
      .populate("lesson", "name");

    if (!leaderboard) {
      return res.status(404).json({ success: false, message: "Leaderboard not found" });
    }

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🧩 Controller: GET Leaderboard by Test Only
export const getLeaderboardForTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const leaderboard = await Leaderboard.findOne({ test: testId })
      .populate("rankings.user", "name email")
      .populate("test", "test_name")
      .populate("subject", "title")
      .populate("lesson", "name");

    if (!leaderboard) {
      return res.status(404).json({ success: false, message: "Leaderboard not found for this test" });
    }

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
