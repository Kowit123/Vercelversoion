const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');
const Database = require('better-sqlite3');
require('dotenv').config();

const router = express.Router();

// สร้างโฟลเดอร์ temp ถ้ายังไม่มี
if (!fs.existsSync('temp')) {
  fs.mkdirSync('temp');
}

// ตั้งค่า multer ให้เก็บไฟล์ไว้ชั่วคราว
const upload = multer({ dest: 'temp/' });

// เปิด SQLite
const db = new Database(path.join(__dirname, '../files.db'));

// สร้างตารางถ้ายังไม่มี
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    blobUrl TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Route รับ POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { password, title, description } = req.body;
    const file = req.file;

    console.log("📥 password ที่ส่งมา:", password);
    console.log("🔐 password ที่อยู่ใน env:", process.env.UPLOAD_PASSWORD);


    console.log("🧪 req.body:", req.body);
    console.log("📎 req.file:", req.file);

    if (!file || !title || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // เช็ก password
    if (password !== process.env.UPLOAD_PASSWORD) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    // อัปโหลดไปยัง Vercel Blob
    const filename = `${Date.now()}-${file.originalname}`;
    const blob = await put(filename, fs.readFileSync(file.path), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // บันทึกลง SQLite
    const stmt = db.prepare('INSERT INTO files (title, description, blobUrl) VALUES (?, ?, ?)');
    const info = stmt.run(title, description, blob.url);

    // ลบไฟล์ temp
    fs.unlinkSync(file.path);

    // ตอบกลับ
    res.json({
      message: 'Upload successful',
      entry: {
        id: info.lastInsertRowid,
        title,
        description,
        blobUrl: blob.url,
      },
    });

  } catch (err) {
    console.error('🔥 Upload error:', err);
    res.status(500).json({ error: 'Upload failed', detail: err.message });
  }
});

module.exports = router;
