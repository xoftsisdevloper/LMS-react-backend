import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: function() { return !this.isAdmin } }
})

export default mongoose.model("User", userSchema)