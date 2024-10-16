import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content_type: {
      type: String,
      enum: ['PDF', 'Video', 'Document', 'Image'],
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    content_url: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Material', materialSchema);
