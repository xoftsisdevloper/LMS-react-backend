import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: []
    }],
    profilePicture: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    preferences: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema)