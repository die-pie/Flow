import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  themePreferences: {
    type: Object,
    default: {} 
  },
  favorites: [{
      postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
      lineId: String,
      content: String,
      createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Use existing model if defined (likely in serverless hot-reload) or create new
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
