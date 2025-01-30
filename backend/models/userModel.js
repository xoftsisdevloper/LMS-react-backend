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
    institution: {
      type: String,
      default: null,
    },
    phoneNumber: { 
      type: Number,
      required: true,
    },
    educationLevel: {
      type: String,
      default: null,
    },
    schoolClass: {
      type: String,
      default: null,
    },
    collegeDegree: {
      type: String,
      default: null,
    },
    customCollegeDegree: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
