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
    courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          default: [],
        }
    ],
    users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: [],
        }
    ]
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);