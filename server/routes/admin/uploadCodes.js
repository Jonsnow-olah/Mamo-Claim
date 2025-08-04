import express from 'express';
import { initDB } from '../../db.js';
import { authMiddleware } from '../../middleware/auth.js';


const router = express.Router();


router.post('/', authMiddleware, async (req, res) => {
  const { projectSlug, codes } = req.body;


  console.log('📥 Received projectSlug:', projectSlug);


  if (!projectSlug || !codes || !Array.isArray(codes)) {
    return res.status(400).json({ error: 'projectSlug and codes[] are required' });
  }


  const db = await initDB();


  try {
    // Try to get the project by slug
    let project = await db.get('SELECT id FROM projects WHERE slug = ?', [projectSlug]);


    if (!project) {
      // Auto-create project if not found
      await db.run('INSERT INTO projects (name, slug) VALUES (?, ?)', [projectSlug, projectSlug]);
      project = await db.get('SELECT id FROM projects WHERE slug = ?', [projectSlug]);
      console.log(`✅ Created new project: ${projectSlug}`);
    } else {
      console.log(`✅ Found existing project: ${projectSlug} (id: ${project.id})`);
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
    console.error('❌ Upload error:', err);
    res.status(500).json({ error: 'Failed to upload codes' });
  }
});


export default router;
