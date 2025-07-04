const Database = require('better-sqlite3');
const path = require('path');

// ชี้ไปยังไฟล์ฐานข้อมูล ชื่อว่า files.db (จะสร้างให้อัตโนมัติถ้ายังไม่มี)
const db = new Database(path.join(__dirname, 'files.db'));

// สร้างตารางชื่อ files ถ้ายังไม่มี
db.exec(`
  CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    blobUrl TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.close();
