import express from 'express';
import { initDB } from '../../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { discord_id, project_slug } = req.body;

  if (!discord_id || !project_slug) {
    return res.status(400).json({ error: 'discord_id and project_slug are required.' });
  }

  const db = await initDB();

  try {
    // Get project
    const project = await db.get(`SELECT id FROM projects WHERE slug = ?`, project_slug);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user already claimed
    const existing = await db.get(
      `SELECT code FROM codes WHERE discord_id = ? AND project_id = ?`,
      discord_id,
      project.id
    );
    if (existing) {
      return res.json({ message: 'Code already claimed', code: existing.code });
    }

    // Get an unclaimed code
    const unclaimed = await db.get(
      `SELECT id, code FROM codes WHERE redeemed = 0 AND project_id = ? LIMIT 1`,
      project.id
    );
    if (!unclaimed) {
      return res.status(404).json({ error: 'No available codes left' });
    }

    // Mark it as claimed
    await db.run(
      `UPDATE codes SET redeemed = 1, discord_id = ? WHERE id = ?`,
      discord_id,
      unclaimed.id
    );

    return res.json({ message: 'Code claimed successfully', code: unclaimed.code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
