import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

// ใช้ __dirname ใน ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// เชื่อมกับ SQLite
const dbPath = path.join(__dirname, '../db/files.db');
const db = new Database(dbPath);

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { keyword } = req.body;
    const stmt = db.prepare(`
      SELECT title, description, blobUrl 
      FROM files 
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY created_at DESC
    `);

    const likeKeyword = `%${keyword}%`;
    const results = stmt.all(likeKeyword, likeKeyword);

    return res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
