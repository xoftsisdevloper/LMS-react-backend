import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String }, // Add comment field
    createdAt: { type: Date, default: Date.now }
});

const progressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedMaterials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }], // Track completed materials
    progress: { type: Number, default: 0 } // Store the progress percentage
});

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    description: { 
        type: String, 
        required: true,
        trim: true 
    },
    duration: { 
        type: Number, 
        required: true,
        min: 1
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'],
        default: 'active'
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subject' 
    }],
    ratings: [ratingSchema],
    progress: [progressSchema],
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
export default Course;