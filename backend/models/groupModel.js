import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
    },
    description: { 
        type: String, 
        required: true
    },
    duration: { 
        type: Number,
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'],
        default: 'active'
    },
    course_ids: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course', // Reference the Course model
          default: [],
        }
    ],
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);