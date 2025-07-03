const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
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

// Admin password
const ADMIN_PASSWORD = '1234';

module.exports = (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use multer to handle file upload
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'File upload error: ' + err.message });
    }

    const { password, title, description } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const metadataFile = path.join(process.cwd(), 'public', 'data.json');
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
}; 