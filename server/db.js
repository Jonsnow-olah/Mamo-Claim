import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDB = async () => {
  const db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database,
  });

  // Admin users (for login)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `);

  // Different project configurations
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      slug TEXT UNIQUE
    );
  `);

  // Uploaded codes per project
  await db.exec(`
    CREATE TABLE IF NOT EXISTS codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT,
      discord_id TEXT,
      project_id INTEGER,
      used_by TEXT,
      used_at TEXT,
      redeemed INTEGER DEFAULT 0,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
  `);

  // Text configuration for frontend display
  await db.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER,
      heading TEXT,
      FOREIGN KEY(project_id) REFERENCES projects(id)
    );
  `);

  // Insert default project if not exists
  const existing = await db.get(`SELECT id FROM projects WHERE slug = ?`, ['mamo-claim']);
  if (!existing) {
    await db.run(`INSERT INTO projects (name, slug) VALUES (?, ?)`, ['Mamo Claim', 'mamo-claim']);
    console.log('Inserted default project: mamo-claim');
  }

  return db;
};
