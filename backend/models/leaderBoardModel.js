import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },

  best_score: { type: Number, default: 0 },

  rankings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      score: { type: Number, required: true },
      rank: { type: Number },
      time_submitted: { type: Date, default: Date.now } // 🆕 Time of submission
    }
  ]
}, { timestamps: true });

export default mongoose.model('Leaderboard', leaderboardSchema);
