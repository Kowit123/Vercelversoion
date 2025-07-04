const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '/.env') });
console.log("🧪 ENV password test:", process.env.UPLOAD_PASSWORD);

// ... rest of your code ...



const express = require('express');
const app = express();

// โหลด route
const uploadRoute = require('../api/upload');
app.use(express.static(path.join(__dirname, './Form/my-upload/public')));
app.use(express.static(path.join(__dirname, '.'))); // เสิร์ฟโฟลเดอร์เดียวกับ server.js



// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static files
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api/upload', uploadRoute);

// run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
