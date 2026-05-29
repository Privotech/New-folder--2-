# PrivoKeep API Server

The backend API server for PrivoKeep - a beautiful Google Keep-style note-taking application.

## Features

- **User Authentication** - Secure JWT-based authentication
- **Note Management** - Full CRUD operations for notes
- **Color Coding** - Support for 5 note colors
- **Pinning & Archiving** - Organize notes efficiently
- **Tag Support** - Add tags to notes for better organization
- **Attachment Support** - Store file references with notes
- **Collaboration** - Share notes with other users (with roles)
- **Database Indexing** - Optimized MongoDB queries
- **Error Handling** - Comprehensive error responses

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Bcryptjs** - Password hashing
- **JWT** - Authentication tokens
- **CORS** - Cross-origin support
- **Dotenv** - Environment configuration
- **Nodemon** - Development auto-reload

## Installation

### Prerequisites

- Node.js v14 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/privokeep
   JWT_SECRET=your_super_secret_key_change_me
   PORT=5001
   NODE_ENV=development
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. For production:
   ```bash
   npm start
   ```

The server will run on `http://localhost:5001`

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint    | Description       | Auth |
| ------ | ----------- | ----------------- | ---- |
| POST   | `/register` | Register new user | No   |
| POST   | `/login`    | Login user        | No   |
| POST   | `/logout`   | Logout user       | Yes  |

### User Routes (`/api/users`)

| Method | Endpoint | Description           | Auth |
| ------ | -------- | --------------------- | ---- |
| GET    | `/me`    | Get current user info | Yes  |
| PUT    | `/me`    | Update user profile   | Yes  |
| DELETE | `/me`    | Delete user account   | Yes  |

### Note Routes (`/api/notes`)

| Method | Endpoint       | Description           | Auth |
| ------ | -------------- | --------------------- | ---- |
| GET    | `/`            | Get all notes         | Yes  |
| POST   | `/`            | Create new note       | Yes  |
| GET    | `/:id`         | Get specific note     | Yes  |
| PUT    | `/:id`         | Update note           | Yes  |
| DELETE | `/:id`         | Delete note           | Yes  |
| PATCH  | `/:id/pin`     | Toggle pin status     | Yes  |
| PATCH  | `/:id/archive` | Toggle archive status | Yes  |

### Project Routes (`/api/projects`)

| Method | Endpoint | Description      | Auth |
| ------ | -------- | ---------------- | ---- |
| GET    | `/`      | Get all projects | Yes  |
| POST   | `/`      | Create project   | Yes  |
| PUT    | `/:id`   | Update project   | Yes  |
| DELETE | `/:id`   | Delete project   | Yes  |

### Reminder Routes (`/api/reminders`)

| Method | Endpoint | Description       | Auth |
| ------ | -------- | ----------------- | ---- |
| GET    | `/`      | Get all reminders | Yes  |
| POST   | `/`      | Create reminder   | Yes  |
| PUT    | `/:id`   | Update reminder   | Yes  |
| DELETE | `/:id`   | Delete reminder   | Yes  |

## Database Models

### User Model

```json
{
  "_id": "ObjectId",
  "email": "user@example.com",
  "password": "hashed_password",
  "name": "User Name",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### Note Model

```json
{
  "_id": "ObjectId",
  "title": "Note Title",
  "content": "Note content",
  "userId": "ObjectId",
  "projectId": "ObjectId (optional)",
  "color": "yellow|blue|green|pink|purple",
  "tags": ["tag1", "tag2"],
  "isPinned": false,
  "isArchived": false,
  "attachments": [
    {
      "filename": "file.txt",
      "url": "https://...",
      "type": "text/plain",
      "uploadedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "collaborators": [
    {
      "userId": "ObjectId",
      "role": "viewer|editor"
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

All errors return a JSON response with an error message.

## Middleware

### Authentication Middleware

Validates JWT tokens and attaches user info to requests.

### Error Handler Middleware

Catches and formats all application errors.

## Database Indexing

The models include strategic indexes for optimal query performance:

- User email lookup
- Note searches by userId and date
- Pinned notes lookup

## Environment Variables

| Variable      | Description                | Example                               |
| ------------- | -------------------------- | ------------------------------------- |
| `MONGODB_URI` | MongoDB connection string  | `mongodb://localhost:27017/privokeep` |
| `JWT_SECRET`  | Secret key for JWT signing | `your_secret_key`                     |
| `PORT`        | Server port                | `5001`                                |
| `NODE_ENV`    | Environment                | `development` or `production`         |

## Development

### Run with nodemon (auto-reload)

```bash
npm run dev
```

### Run in production mode

```bash
npm start
```

## Project Structure

```
Client/i/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── Pages/
│   │   ├── TodoApp.jsx
│   │   ├── TodoApp.css
│   │   └── components/
│   │       ├── TodoForm.jsx
│   │       ├── TodoForm.css
│   │       ├── TodoList.jsx
│   │       ├── TodoList.css
│   │       ├── TodoFilters.jsx
│   │       ├── TodoFilters.css
│   │       ├── TodoStats.jsx
│   │       ├── Icons.jsx
│   │       ├── TodoStats.css
│   │       └── TodoList.css

rver/
├── models/
│   └── Todo.js
├── controllers/
│   └── todoController.js
├── routes/
│   └── todoRoutes.js
├── config/
│   └── db.js
├── middleware/
│   └── errorHandler.js
├── Index.js
└── .env
```

## License

This project is open source and available under the MIT License.

## Tips for Best Results

1. Keep todo titles concise and clear
2. Use categories to organize by context (Work, Personal, Urgent, etc.)
3. Set realistic due dates
4. Review completed items to track progress
5. Use the dark mode for comfortable viewing

Enjoy organizing your tasks!
