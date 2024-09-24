import mongoose from "mongoose"

const MaterialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    accessibleByGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
})

const Material = mongoose.model("Material", MaterialSchema)

export default Material