
import { initDB } from '../../db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { discord_id, project_slug } = req.body;

  if (!discord_id || !project_slug) {
    return res.status(400).json({ error: 'Missing discord_id or project_slug' });
  }

  try {
    const db = await initDB();

    const project = await db.get(
      'SELECT id FROM projects WHERE slug = ?',
      project_slug
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const codes = await db.all(
      `SELECT code, redeemed FROM codes WHERE discord_id = ? AND project_id = ?`,
      discord_id,
      project.id
    );

    res.status(200).json({
      success: true,
      codes,
    });

  } catch (error) {
    console.error('Error fetching user codes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
