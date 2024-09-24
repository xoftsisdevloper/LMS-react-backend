import mongoose from "mongoose"

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
})

const Course = mongoose.model('Course', CourseSchema)
export default Course