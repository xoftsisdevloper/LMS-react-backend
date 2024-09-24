import mongoose from "mongoose"

const SubjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Material' }],
})
  
export default mongoose.model('Subject', SubjectSchema)