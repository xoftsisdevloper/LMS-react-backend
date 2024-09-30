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
    }
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);