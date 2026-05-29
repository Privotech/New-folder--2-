# PrivoKeep - Advanced Setup Guide

## 🚀 New Features

PrivoKeep has been upgraded with powerful advanced features:

### 1. **Image Upload with Cloudinary**

- Upload and store images directly in notes
- Images are stored on Cloudinary CDN for optimal performance
- Automatic thumbnail generation
- Optimized image delivery

### 2. **Advanced Organization**

- Categories: Personal, Work, Ideas, Research
- Priority levels: Low, Medium, High, Urgent
- Custom tags and labels
- Favorites/Bookmarks system

### 3. **Collaboration Features**

- Share notes with specific people
- Granular permissions (Viewer/Editor)
- Public share links
- Access tracking

### 4. **Smart Reminders**

- Set due dates on notes
- Recurring reminders (Daily, Weekly, Monthly)
- Notification system

### 5. **Advanced Search & Filtering**

- Search by date range
- Filter by priority, category, tags
- Filter notes with images
- Show only favorites or shared notes

### 6. **Rich Media Support**

- Multiple images per note
- Image captions
- Voice notes (ready to implement)
- Code snippets

### 7. **Note History & Versioning**

- Automatic version tracking
- View note history
- Restore previous versions
- Change summaries

## 🔧 Setup Instructions

### Backend Setup

1. **Update Environment Variables (.env)**

```bash
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. **Install Cloudinary SDK (if not already installed)**

```bash
npm install cloudinary next-cloudinary
```

3. **Update Note Controller**
   The note controller has been updated to handle:

- Image uploads to Cloudinary
- Categories and priorities
- Reminders and due dates
- Collaboration/sharing

### Frontend Setup

1. **Create .env file in Client/i/**

```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

2. **Get Cloudinary Credentials**

- Go to https://cloudinary.com
- Sign up for a free account
- Navigate to Settings → API Keys
- Copy your Cloud Name
- Create an unsigned upload preset in Settings → Upload

3. **Unsigned Upload Preset Setup**

- In Cloudinary Dashboard: Settings → Upload
- Add new Upload Preset
- Set "Signing Mode" to "Unsigned"
- Allow file types: images
- Note the preset name for VITE_CLOUDINARY_UPLOAD_PRESET

## 🎨 New Components

### ImageUploader.jsx

Handles file selection and Cloudinary integration

```javascript
import { ImageUploader } from "./ImageUploader";

// Usage in forms
<ImageUploader onImagesUpload={handleImagesUpload} />;
```

### AdvancedFilters.jsx

Powerful filtering system

```javascript
<AdvancedFilters
  onFilterChange={handleFilterChange}
  categories={categories}
  priorities={priorities}
/>
```

### ShareModal.jsx

Easy note sharing

```javascript
<ShareModal
  noteId={id}
  isOpen={showShare}
  onClose={() => setShowShare(false)}
  onShare={handleShare}
/>
```

## 📊 Enhanced Note Schema

Notes now support:

- Images with metadata (URL, dimensions, captions)
- Priority levels (low, medium, high, urgent)
- Categories for organization
- Due dates and reminders
- Collaboration settings
- Public sharing with links
- Version history
- Checklists
- Voice notes
- Code snippets

## 🔐 Security Features

- Secure image hosting on Cloudinary CDN
- Access control for shared notes
- Role-based permissions
- Secure share links with expiry

## 📱 Mobile Optimization

All new features are fully responsive:

- Touch-friendly image uploaders
- Mobile-optimized filters
- Responsive image grids
- Touch-optimized sharing

## 🚢 Deployment Checklist

- [ ] Set Cloudinary environment variables
- [ ] Update MongoDB schema
- [ ] Deploy backend changes
- [ ] Deploy frontend updates
- [ ] Test image uploads
- [ ] Verify sharing functionality
- [ ] Test advanced filters
- [ ] Check mobile responsiveness

## 💡 Usage Examples

### Upload Images

```javascript
const handleImagesUpload = (uploadedImages) => {
  setNotes((prev) => ({
    ...prev,
    images: [...prev.images, ...uploadedImages],
  }));
};
```

### Filter Notes

```javascript
const handleFilterChange = (filters) => {
  // Filter notes based on:
  // - filters.category
  // - filters.priority
  // - filters.dateRange
  // - filters.onlyFavorited
  // - filters.hasImages
  // - filters.onlyShared
};
```

### Share Note

```javascript
const handleShare = ({ noteId, email, role }) => {
  // API call to share note with user
  fetch("/api/notes/share", {
    method: "POST",
    body: JSON.stringify({ noteId, email, role }),
  });
};
```

## 🐛 Troubleshooting

### Images not uploading?

- Check Cloudinary credentials in .env
- Verify unsigned upload preset exists
- Check browser console for CORS errors
- Ensure file size < 100MB

### Filters not working?

- Verify filter component receives notes data
- Check date comparison logic
- Ensure note properties match filter keys

### Sharing issues?

- Verify backend sharing routes are configured
- Check email field validation
- Ensure JWT tokens are valid

## 🔜 Future Enhancements

- [ ] AI-powered note summaries
- [ ] Voice-to-text conversion
- [ ] Real-time collaboration
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Advanced AI search
- [ ] Note templates

## 📚 Additional Resources

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
