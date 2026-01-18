import { connectToDatabase } from '../server/utils/db.js';
import { getFeed } from '../server/controllers/feedController.js';
import jwt from 'jsonwebtoken';
import User from '../server/models/User.js';

export default async function handler(req, res) {
  // CORS Handling for local dev vs Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-auth-token'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
      try {
        await connectToDatabase();

        const { cursor, limit } = req.query;
        const limitNum = parseInt(limit) || 5; 

        const data = await getFeed(limitNum, cursor);
        return res.status(200).json(data);

      } catch (error) {
        console.error("Feed API Error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  }

  if (req.method === 'POST') {
      const token = req.headers['x-auth-token'];
      if (!token) return res.status(401).json({ msg: 'No token' });

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        await connectToDatabase();
        
        const user = await User.findById(decoded.user.id);
        if (!user) return res.status(401).json({ msg: 'User not found' });

        const { createPost } = await import('../server/controllers/feedController.js');
        
        // Simple validation
        if (!req.body.title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newPost = await createPost({
            ...req.body,
            type: req.body.type || 'text', // Default to text
            author: user._id,
            authorName: user.username
        });

        return res.status(201).json(newPost);
      } catch (error) {
        console.error("Create Post Error:", error);
        return res.status(500).json({ error: error.message });
      }
  }
  
  if (req.method === 'DELETE') {
      try {
        await connectToDatabase();
        const { deletePost } = await import('../server/controllers/feedController.js');
        
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        await deletePost(id);
        return res.status(200).json({ message: 'Post deleted' });

      } catch (error) {
        console.error("Delete Post Error:", error);
        return res.status(500).json({ error: error.message });
      }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
