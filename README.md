# Vercel PDF Upload System

A PDF upload and management system designed to work with Vercel's serverless platform.

## Features

- 📤 Upload PDF files with metadata (title, description)
- 🔍 Search through uploaded documents
- 🗑️ Delete documents with admin authentication
- 🔐 Password-protected admin interface
- 📱 Responsive design with Tailwind CSS

## Setup

1. **Deploy to Vercel:**
   ```bash
   vercel
   ```

2. **Environment Variables:**
   - No environment variables required (admin password is hardcoded as '1234')

## API Endpoints

- `POST /api/upload` - Upload a PDF file with metadata
- `POST /api/delete` - Delete a document by ID
- `POST /api/search` - Search documents by keyword

## File Structure

```
├── api/                    # Vercel serverless functions
│   ├── upload.js          # File upload endpoint
│   ├── delete.js          # Document deletion endpoint
│   └── search.js          # Search endpoint
├── public/                # Static files
│   ├── admin.html         # Admin interface
│   ├── search.html        # Search interface
│   ├── data.json          # Document metadata
│   └── uploads/           # Uploaded PDF files
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## Usage

1. **Admin Interface:** Visit `/admin.html` and use password `1234`
2. **Search Interface:** Visit `/search.html` to search documents
3. **Main Interface:** Visit `/index.html` for the main application

## Dependencies

- `formidable` - File upload handling
- `vercel` - Development and deployment

## Notes

- Files are stored in the `public/uploads/` directory
- Document metadata is stored in `public/data.json`
- Admin password is currently hardcoded as '1234'
- The system is designed for Vercel's serverless environment 