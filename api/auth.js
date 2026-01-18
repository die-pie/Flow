import { connectToDatabase } from '../server/utils/db.js';
import User from '../server/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper for sending token
const sendToken = (user, res) => {
  const payload = {
    user: {
      id: user.id
    }
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET || 'secret',
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.status(200).json({ 
          token, 
          user: { 
              id: user.id, 
              username: user.username, 
              themePreferences: user.themePreferences,
              favorites: user.favorites
          } 
      });
    }
  );
};

export default async function handler(req, res) {
  // CORS
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

  await connectToDatabase();

  if (req.method === 'POST') {
    const { action } = req.query; // ?action=register or ?action=login
    
    // 1. REGISTER
    if (action === 'register') {
        const { username, password } = req.body;
        try {
            let user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({
                username,
                password,
                themePreferences: {},
                favorites: []
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            return sendToken(user, res);

        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
    }

    // 2. LOGIN
    if (action === 'login') {
        const { username, password } = req.body;
        try {
            let user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            return sendToken(user, res);

        } catch (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
    }
    
    return res.status(400).json({ msg: 'Specify action=register or action=login' });
  }
  
  // 3. GET USER
  if (req.method === 'GET') {
      const token = req.headers['x-auth-token'];
      if (!token) return res.status(401).json({ msg: 'No token' });

      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          const user = await User.findById(decoded.user.id).select('-password');
          return res.json(user);
      } catch (err) {
          return res.status(401).json({ msg: 'Token is not valid' });
      }
  }

  // 4. UPDATE USER (Theme / Favorites)
  if (req.method === 'PUT') {
      const token = req.headers['x-auth-token'];
      if (!token) return res.status(401).json({ msg: 'No token' });

      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          const userId = decoded.user.id;
          const { action } = req.query;

          if (action === 'theme') {
             // req.body contains theme object
             const user = await User.findByIdAndUpdate(userId, 
                 { $set: { themePreferences: req.body } },
                 { new: true }
             ).select('-password');
             return res.json(user);
          }

          if (action === 'favorite') {
             const { postId, lineId, content, isLiked } = req.body;
             let update = {};
             if (isLiked) {
                 update = { $addToSet: { favorites: { postId, lineId, content } } };
             } else {
                 update = { $pull: { favorites: { postId, lineId } } };
             }
             
             const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
             return res.json(user.favorites);
          }
      } catch (err) {
          console.error(err);
          return res.status(500).send('Server error');
      }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
