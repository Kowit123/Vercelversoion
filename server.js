// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import delete route
const deleteRoute = require('./api/delete');
app.use('/api/delete', deleteRoute);

// config upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
      const originalName = file.originalname;
      const ext = path.extname(originalName) || '.pdf';
      const timestamp = Date.now();
      const safeName = originalName
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '');
      cb(null, `${timestamp}-${safeName}`);
    }
  });
  
  const upload = multer({ storage });
  

// ใช้สำหรับ password (แก้ตรงนี้ได้)
const ADMIN_PASSWORD = '1234';

// API: Upload PDF + metadata
app.post('/api/upload', upload.single('file'), (req, res) => {
  const { password, title, description} = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const metadataFile = path.join(__dirname, 'public', 'data.json');
  let data = [];

  if (fs.existsSync(metadataFile)) {
    data = JSON.parse(fs.readFileSync(metadataFile));
  }

  const newEntry = {
    id: Date.now().toString(),
    title,
    description,
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadedAt: new Date().toISOString(),
  };

  data.push(newEntry);
  fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2));

  return res.json({ message: 'Upload successful', entry: newEntry });
});

// API: Search by keyword
app.post('/api/search', (req, res) => {
  const { keyword } = req.body;
  const metadataFile = path.join(__dirname, 'public', 'data.json');

  if (!fs.existsSync(metadataFile)) return res.json([]);

  const data = JSON.parse(fs.readFileSync(metadataFile));
  const results = data.filter((item) => {
    const lower = keyword.toLowerCase();
    return (
      item.title.toLowerCase().includes(lower) ||
      item.description.toLowerCase().includes(lower)
    );
  });

  res.json(results);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});