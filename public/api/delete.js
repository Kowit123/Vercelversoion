const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();


// ต้อง import password มาจาก config หรือกำหนดเองตรงนี้ก็ได้
const ADMIN_PASSWORD = '1234';

router.post('/', (req, res) => {
  const { id, password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const metadataFile = path.join(__dirname, '../public/data.json');
  if (!fs.existsSync(metadataFile)) return res.status(404).json({ error: 'No metadata found' });

  let data = JSON.parse(fs.readFileSync(metadataFile));
  const docIndex = data.findIndex(entry => entry.id === id);

  if (docIndex === -1) return res.status(404).json({ error: 'Document not found' });

  const doc = data[docIndex];
  const pdfPath = path.join(__dirname, '../public/uploads', doc.filename);

  if (fs.existsSync(pdfPath)) {
    fs.unlinkSync(pdfPath);
  }

  data.splice(docIndex, 1);
  fs.writeFileSync(metadataFile, JSON.stringify(data, null, 2));

  res.json({ message: 'Document deleted successfully', id });
});

module.exports = router;
