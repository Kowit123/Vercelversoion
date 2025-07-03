# Vercel PDF Upload System

A PDF upload and management system designed to work with Vercel's serverless platform.

## Features

- 📤 Upload PDF files with metadata (title, description)
- 🔍 Search through uploaded documents
- 🗑️ Delete documents with admin authentication
- 🔐 Password-protected admin interface
- 📱 Responsive design with Tailwind CSS
- 💾 Client-side storage for serverless compatibility

## Architecture

This system is designed specifically for Vercel's serverless environment:

- **Serverless Functions**: API endpoints handle authentication and data processing
- **Client-Side Storage**: Documents are stored in browser localStorage as base64 data
- **No File System**: Avoids serverless filesystem limitations
- **Real-time Search**: Instant client-side search functionality

## Setup

1. **Deploy to Vercel:**
   ```bash
   vercel
   ```

2. **Environment Variables:**
   - No environment variables required (admin password is hardcoded as '1234')

## API Endpoints

- `POST /api/upload` - Upload a PDF file with metadata (returns base64 data)
- `POST /api/delete` - Authorize document deletion (client-side removal)
- `POST /api/search` - Search endpoint (redirects to client-side search)

## File Structure

```
├── api/                    # Vercel serverless functions
│   ├── upload.js          # File upload endpoint (base64 conversion)
│   ├── delete.js          # Document deletion authorization
│   └── search.js          # Search endpoint (client-side redirect)
├── public/                # Static files
│   ├── admin.html         # Admin interface with local storage
│   ├── search.html        # Search interface with client-side search
│   └── index.html         # Main application interface
├── vercel.json           # Vercel configuration
└── package.json          # Dependencies
```

## Usage

1. **Admin Interface:** Visit `/admin.html` and use password `1234`
   - Upload PDF files with metadata
   - Files are stored as base64 in browser localStorage
   - Download and delete functionality included

2. **Search Interface:** Visit `/search.html` to search documents
   - Instant client-side search
   - Download files directly from browser storage

3. **Main Interface:** Visit `/index.html` for the main application

## Technical Details

- **File Storage**: PDFs are converted to base64 and stored in browser localStorage
- **Data Persistence**: Documents persist across browser sessions
- **File Size**: Limited by localStorage capacity (~5-10MB per browser)
- **Security**: Admin password required for upload/delete operations
- **Compatibility**: Works with Vercel's serverless architecture

## Limitations

- Files are stored locally in the browser (not on server)
- Storage limited by browser localStorage capacity
- Data is not shared between different browsers/devices
- No server-side file storage

## Future Improvements

- Integrate with cloud storage (AWS S3, Google Cloud Storage)
- Add database for metadata storage
- Implement user authentication system
- Add file compression for larger documents

## Dependencies

- No server-side dependencies required
- Uses browser APIs for file handling and storage 