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
      enum: ['School', 'College', 'Graduated'],
      default: null,
    },
    schoolClass: {
      type: String,
      enum: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
      default: null,
    },
    collegeDegree: {
      type: String,
      enum: [
        'BSc', 
        'BA',  // Bachelor of Arts
        'BCA', // Bachelor of Computer Applications
        'BCom', // Bachelor of Commerce
        'BBA', // Bachelor of Business Administration
        'BE',  // Bachelor of Engineering
        'BS',  // Bachelor of Science (variant)
        'MSc', // Master of Science
        'MA',  // Master of Arts
        'MCA', // Master of Computer Applications
        'MCom', // Master of Commerce
        'MBA', // Master of Business Administration
        'ME',  // Master of Engineering
        'MS',  // Master of Science (variant)
        'Other' // For degrees not listed
      ],
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
