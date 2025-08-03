
import express from 'express';
import { initDB } from '../../db.js';
import { authMiddleware } from '../../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { projectSlug, codes } = req.body;

  if (!projectSlug || !codes || !Array.isArray(codes)) {
    return res.status(400).json({ error: 'projectSlug and codes[] are required' });
  }

  const db = await initDB();

  try {
    const project = await db.get('SELECT id FROM projects WHERE slug = ?', [projectSlug]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const insertStmt = await db.prepare(`
      INSERT INTO codes (code, project_id) VALUES (?, ?)
    `);

    for (const code of codes) {
      await insertStmt.run(code, project.id);
    }

    await insertStmt.finalize();

    res.json({ message: `Uploaded ${codes.length} codes to project "${projectSlug}"` });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to upload codes' });
  }
});

export default router;
