const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

// Admin password
const ADMIN_PASSWORD = '1234';

export default async function handler(req, res) {
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

  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    form.keepExtensions = true;
    
    // Ensure upload directory exists
    if (!fs.existsSync(form.uploadDir)) {
      fs.mkdirSync(form.uploadDir, { recursive: true });
    }

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: 'File upload error: ' + err.message });
      }

      const { password, title, description } = fields;
      
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      if (!files.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = files.file;
      const originalName = file.originalFilename || file.name;
      const timestamp = Date.now();
      const safeName = originalName
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9.-]/g, '');
      const newFilename = `${timestamp}-${safeName}`;
      
      // Move file to final location
      const finalPath = path.join(form.uploadDir, newFilename);
      fs.renameSync(file.filepath, finalPath);

      const metadataFile = path.join(process.cwd(), 'public', 'data.json');
      let data = [];

      if (fs.existsSync(metadataFile)) {
        data = JSON.parse(fs.readFileSync(metadataFile));
      }

      const newEntry = {
        id: timestamp.toString(),
        title,
        description,
        filename: newFilename,
        originalName,
        uploadedAt: new Date().toISOString(),
      };

      data.push(newEntry);
      fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2));

      return res.json({ message: 'Upload successful', entry: newEntry });
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 