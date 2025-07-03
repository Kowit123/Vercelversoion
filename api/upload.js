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

  // Admin password
  const ADMIN_PASSWORD = '1234';

  try {
    // Parse multipart form data manually since we can't use formidable in serverless
    const contentType = req.headers['content-type'] || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
    }

    // Get the raw body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Parse multipart data
    const boundary = contentType.split('boundary=')[1];
    const parts = parseMultipartData(buffer, boundary);
    
    const password = parts.password;
    const title = parts.title;
    const description = parts.description;
    const fileData = parts.file;

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    if (!fileData) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const timestamp = Date.now();
    const originalName = fileData.filename || 'document.pdf';
    const safeName = originalName
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9.-]/g, '');
    const newFilename = `${timestamp}-${safeName}`;

    // Convert file to base64 for storage
    const base64Data = fileData.data.toString('base64');

    const newEntry = {
      id: timestamp.toString(),
      title,
      description,
      filename: newFilename,
      originalName,
      uploadedAt: new Date().toISOString(),
      fileData: base64Data, // Store file as base64
      fileSize: fileData.data.length
    };

    // In a real application, you would store this in a database
    // For now, we'll return the data to the client to store
    return res.json({ 
      message: 'Upload successful', 
      entry: newEntry,
      note: 'File data returned as base64. Store this data in your preferred storage solution.'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
}

// Helper function to parse multipart form data
function parseMultipartData(buffer, boundary) {
  const parts = {};
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const endBoundaryBuffer = Buffer.from(`--${boundary}--`);
  
  let start = buffer.indexOf(boundaryBuffer) + boundaryBuffer.length;
  
  while (start < buffer.length) {
    // Find the end of this part
    const end = buffer.indexOf(boundaryBuffer, start);
    if (end === -1) break;
    
    const partBuffer = buffer.slice(start, end);
    
    // Find the header/body separator
    const headerEnd = partBuffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) {
      start = end + boundaryBuffer.length;
      continue;
    }
    
    const headers = partBuffer.slice(0, headerEnd).toString();
    const body = partBuffer.slice(headerEnd + 4);
    
    // Parse headers to find name and filename
    const nameMatch = headers.match(/name="([^"]+)"/);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    
    if (nameMatch) {
      const name = nameMatch[1];
      if (filenameMatch) {
        // This is a file
        parts[name] = {
          filename: filenameMatch[1],
          data: body.slice(0, -2) // Remove trailing \r\n
        };
      } else {
        // This is a regular field
        parts[name] = body.slice(0, -2).toString(); // Remove trailing \r\n
      }
    }
    
    start = end + boundaryBuffer.length;
  }
  
  return parts;
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 