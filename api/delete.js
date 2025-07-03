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

    // Since we're storing data locally in the browser, 
    // the actual deletion happens on the client side
    // This API just validates the password and confirms the deletion
    return res.json({ 
      message: 'Document deletion authorized', 
      id,
      note: 'Document will be removed from local storage on the client side.'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
} 