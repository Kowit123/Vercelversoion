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
    
    // Since documents are stored locally in the browser,
    // search should be performed client-side
    return res.json({ 
      message: 'Search should be performed client-side',
      note: 'Documents are stored in browser localStorage. Use client-side search functionality.',
      keyword: keyword
    });
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
} 