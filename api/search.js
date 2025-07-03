import fs from 'fs';
import path from 'path';

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
    const { keyword } = req.body;
    const metadataFile = path.join(process.cwd(), 'public', 'data.json');

    if (!fs.existsSync(metadataFile)) {
      return res.json([]);
    }

    const data = JSON.parse(fs.readFileSync(metadataFile));
    const results = data.filter((item) => {
      const lower = keyword.toLowerCase();
      return (
        item.title.toLowerCase().includes(lower) ||
        (item.description && item.description.toLowerCase().includes(lower))
      );
    });

    return res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 