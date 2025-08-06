import express from "express";
import { initDB } from "../../db.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { projectSlug, code, discordId } = req.body;

  if (!projectSlug || !code || !discordId) {
    return res
      .status(400)
      .json({ error: "projectSlug, code, and discordId are required" });
  }

  const db = await initDB();

  try {
    const project = await db.get("SELECT id FROM projects WHERE slug = ?", [
      projectSlug,
    ]);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const existingCode = await db.get(
      "SELECT * FROM codes WHERE code = ? AND project_id = ?",
      [code, project.id]
    );

    if (!existingCode) {
      return res.status(404).json({ error: "Code not found in project" });
    }

    if (existingCode.used) {
      return res.status(400).json({ error: "Code has already been used" });
    }

    if (existingCode.redeemed === 0) {
      return res
        .status(400)
        .json({ error: "Code has not been claimed (redeemed) yet." });
    }

    await db.run(
      `UPDATE codes
       SET used = 1,
           used_by = ?,
           used_at = CURRENT_TIMESTAMP
       WHERE code = ? AND project_id = ?`,
      [discordId, code, project.id]
    );

    res.json({ message: "Code marked as used successfully" });
  } catch (err) {
    console.error("Mark-used error:", err);
    res.status(500).json({ error: "Failed to mark code as used" });
  }
});

export default router;
