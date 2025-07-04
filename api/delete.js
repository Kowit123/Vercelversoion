import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import { del } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB connection
const dbPath = path.join(__dirname, '../db/files.db');
const db = new Database(dbPath);

const ADMIN_PASSWORD = process.env.UPLOAD_PASSWORD;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id, password } = req.body;

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const record = db.prepare('SELECT blobUrl FROM files WHERE id = ?').get(id);
    if (!record) {
      return res.status(404).json({ error: 'File not found in database' });
    }

    // ลบไฟล์บน Vercel Blob
    await del(record.blobUrl);

    // ลบข้อมูลจาก SQLite
    db.prepare('DELETE FROM files WHERE id = ?').run(id);

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}
