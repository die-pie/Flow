import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import feedHandler from './api/feed.js';
import seedHandler from './api/seed.js';
import authHandler from './api/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mimic Vercel's file-system routing
app.all('/api/feed', async (req, res) => {
    await feedHandler(req, res);
});

app.all('/api/auth', async (req, res) => {
    await authHandler(req, res);
});

app.get('/api/seed', async (req, res) => {
    await seedHandler(req, res);
});

app.listen(PORT, () => {
  console.log(`> Local API Server running on http://localhost:${PORT}`);
  console.log(`> Ready to accept requests from Vite client (via proxy)`);
});
