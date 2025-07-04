import { write } from '@vercel/blob';
import { supabase } from '../lib/supabaseClient.js';
import formidable from 'formidable';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false, // ใช้กับ formidable เพื่อรับ multipart/form-data
  },
};

const ADMIN_PASSWORD = process.env.UPLOAD_PASSWORD;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const form = formidable({ multiples: false });
    const [fields, files] = await form.parse(req);

    const { password, title, description } = fields;
    const pdfFile = files.file;

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const pdfBuffer = await fs.readFile(pdfFile[0].filepath);

    // 👑 ตั้งชื่อให้ไฟล์
    const fileName = `${Date.now()}-${encodeURIComponent(pdfFile[0].originalFilename)}`;

    // ⬆️ อัปโหลดขึ้น Vercel Blob
    const blob = await write(fileName, pdfBuffer, {
      access: 'public',
    });

    // 📝 บันทึกข้อมูลลง Supabase
    const { error } = await supabase.from('files').insert([
      {
        title,
        description,
        blob_url: blob.url,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to insert to Supabase' });
    }

    return res.status(200).json({ message: 'Upload complete!', url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
