import express from 'express';
import { initDB } from '../../db.js';


const router = express.Router();


router.post('/', async (req, res) => {
  const { code } = req.body;


  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }


  const db = await initDB();


  try {
    const codeEntry = await db.get(
      `SELECT * FROM codes WHERE code = ? AND redeemed = 1 AND claimed = 0`,
      [code]
    );


    if (!codeEntry) {
      return res.status(404).json({ error: 'Code not found or already claimed' });
    }


    await db.run(
      `UPDATE codes SET claimed = 1 WHERE id = ?`,
      [codeEntry.id]
    );


    res.json({ success: true, message: 'Code marked as claimed' });
  } catch (err) {
    console.error('Redeem error:', err);
    res.status(500).json({ error: 'Failed to redeem code' });
  }
});


export default router;
