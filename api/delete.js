import fs from 'fs';
import path from 'path';

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
    const { id, password } = req.body;
    
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const metadataFile = path.join(process.cwd(), 'public', 'data.json');
    if (!fs.existsSync(metadataFile)) {
      return res.status(404).json({ error: 'No metadata found' });
    }

    let data = JSON.parse(fs.readFileSync(metadataFile));
    const docIndex = data.findIndex(entry => entry.id === id);

    if (docIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = data[docIndex];
    const pdfPath = path.join(process.cwd(), 'public', 'uploads', doc.filename);

    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    data.splice(docIndex, 1);
    fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2));

    return res.json({ message: 'Document deleted successfully', id });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 