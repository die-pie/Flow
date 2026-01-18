import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text'
  },
  content: {
    type: String, // For text posts or captions
    required: false
  },
  mediaUrl: {
    type: String, // URL for images/video
    required: function() { return this.type !== 'text'; }
  },
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    // author name (denormalized)
    authorName: { type: String, default: 'Anonymous' } 
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for legacy/anonymous posts
  },
  // Kinetic Typography settings for this specific post
  typography: {
    fontFamily: { type: String, default: 'Inter' },
    weight: { type: String, default: '700' },
    animationType: { type: String, enum: ['fade', 'slide', 'distort', 'none'], default: 'none' }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Essential for cursor-based pagination sorting
  }
});

// Compound index for cursor pagination (createdAt_desc + _id_desc)
PostSchema.index({ createdAt: -1, _id: -1 });

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
