import mongoose from "mongoose";

const testSubmissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a User model
        required: true
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true
    },
    submitted_at: {
        type: Date,
        default: Date.now
    },
    total_questions: {
        type: Number,
        required: true
    },
    correct_answers: {
        type: Number,
        required: true
    },
    wrong_answers: {
        type: Number,
        required: true
    },
    skipped_questions: {
        type: Number,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    average_score: {
        type: Number
    },
    detailed_answers: [
        {
            question_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            selected_options: [String], // store selected options
            is_correct: Boolean
        }
    ]
}, { timestamps: true });

export default mongoose.model('TestSubmission', testSubmissionSchema);
