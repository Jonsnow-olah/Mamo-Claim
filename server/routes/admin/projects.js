// routes/projects.js
import express from 'express';
import { initDB } from '../../db.js';
import { authMiddleware } from '../../middleware/auth.js';


const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
  const db = await initDB();
  try {
    const projects = await db.all('SELECT name, slug FROM projects ORDER BY id DESC');
    res.json({ projects });
  } catch (err) {
    console.error('❌ Fetch projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});


export default router;
