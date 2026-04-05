import mongoose from 'mongoose';

const ForumPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ForumPost', ForumPostSchema);
