import mongoose from "mongoose"

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

export default mongoose.model("Group", GroupSchema)