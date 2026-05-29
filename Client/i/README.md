# PrivoKeep - Your Personal Notes App

A modern, beautiful note-taking application inspired by Google Keep. Built with React (Frontend) and Express + MongoDB (Backend).

## Features

### Frontend Features

- **Create, Edit, Delete Notes** - Manage your notes effortlessly
- **Color-Coded Notes** - Organize notes with 5 beautiful colors (Yellow, Blue, Green, Pink, Purple)
- **Pin Important Notes** - Keep important notes at the top
- **Archive Notes** - Move notes to archive without deleting them
- **Search & Filter** - Find notes instantly by title, content, or tags
- **Tag Support** - Organize notes with tags
- **Dark Mode** - Comfortable viewing in any lighting
- **Note Grid Layout** - Beautiful Google Keep-style grid layout
- **Pinned Section** - Pinned notes appear at the top
- **Empty States** - Beautiful messaging when no notes exist
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates** - Instant synchronization with backend

### Backend Features

- **MongoDB Integration** - Secure data storage
- **RESTful API** - Clean REST endpoints for note management
- **Authentication** - Secure user authentication with JWT
- **Note Management** - Complete CRUD operations
- **Pin/Archive Functionality** - Server-side pin and archive support
- **User Isolation** - Each user only sees their own notes
- **Error Handling** - Comprehensive error responses

## Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite** - Lightning-fast build tool
- **CSS3** - Beautiful styling with CSS variables and Flexbox/Grid

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **BCrypt** - Password hashing
- **JWT** - Authentication tokens
- **CORS** - Cross-origin request handling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

#### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd rver
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/privokeep
   JWT_SECRET=your_secret_key_here
   PORT=5001
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd Client/i
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

### Frontend (`Client/i/src/`)

```
src/
├── Pages/
│   ├── PrivoKeep.jsx          # Main app component
│   ├── PrivoKeep.css          # Main styles
│   └── components/
│       ├── NoteForm.jsx       # Create/edit note form
│       ├── NoteGrid.jsx       # Note grid container
│       ├── NoteCard.jsx       # Individual note card
│       ├── SearchBar.jsx      # Search functionality
│       ├── AuthPanel.jsx      # Login/register
│       └── Icons.jsx          # SVG icons
├── App.jsx
└── main.jsx
```

### Backend (`rver/`)

```
rver/
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── noteController.js      # Note operations
│   ├── userController.js      # User management
│   └── ...
├── models/
│   ├── Note.js               # Note schema
│   ├── User.js               # User schema
│   └── ...
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   ├── noteRoutes.js         # Note endpoints
│   └── ...
├── middleware/
│   ├── auth.js               # JWT middleware
│   └── errorHandler.js       # Error handling
└── Index.js
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Notes

- `GET /api/notes` - Get all user's notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `PATCH /api/notes/:id/pin` - Toggle pin status
- `PATCH /api/notes/:id/archive` - Toggle archive status

## Note Structure

```json
{
  "_id": "ObjectId",
  "title": "Note Title",
  "content": "Note content here",
  "color": "yellow",
  "tags": ["tag1", "tag2"],
  "isPinned": false,
  "isArchived": false,
  "userId": "ObjectId",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Color Options

- **Yellow** - #fbbc04
- **Blue** - #4285f4
- **Green** - #34a853
- **Pink** - #ea4335
- **Purple** - #a142f4

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Created with ❤️ by the PrivoKeep Team**
