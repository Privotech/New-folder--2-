# Full-Stack Todo Application

A modern, feature-rich todo application built with React (Frontend) and Express + MongoDB (Backend).

## Features

### Frontend Features

- **Add/Edit/Delete Todos** - Manage your tasks easily
- **Search & Filter** - Find todos by title or description
- **Statistics Dashboard** - View progress, completion rate, and urgent tasks
- **Dark Mode** - Easy on the eyes during night work
- **Advanced Sorting** - Sort by priority, due date, or alphabetically
- **Categories** - Organize todos by category
- **Due Dates** - Set and track due dates with visual indicators
- **Priority Levels** - Mark tasks as low, medium, or high priority
- **Bulk Actions** - Select multiple todos and mark complete or delete
- **Export Todos** - Download your todos as JSON
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Real-time Updates** - Instant synchronization with backend

### Backend Features

- **MongoDB Integration** - Persistent data storage
- **RESTful API** - Clean and scalable API endpoints
- **Error Handling** - Comprehensive error management
- **Database Indexing** - Optimized queries for performance
- **Full CRUD Operations** - Complete todo management

## Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Lightning-fast build tool
- **CSS3** - Modern styling with CSS variables

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Dotenv** - Environment configuration
- **CORS** - Cross-origin support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

#### 1. Backend Setup

```bash
cd rver
npm install
```

Create a `.env` file in the `rver` directory:

```env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp
```

Start the backend:

```bash
npm run dev    # Development with nodemon
npm start      # Production
```

#### 2. Frontend Setup

```bash
cd Client/i
npm install
```

Start the frontend:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the Vite default port)

## API Endpoints

### Todos

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api/todos`            | Get all todos            |
| POST   | `/api/todos`            | Create new todo          |
| GET    | `/api/todos/:id`        | Get specific todo        |
| PUT    | `/api/todos/:id`        | Update todo              |
| DELETE | `/api/todos/:id`        | Delete todo              |
| PATCH  | `/api/todos/:id/toggle` | Toggle completion status |

### Todo Object Schema

```javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  description: String (max 1000 chars),
  completed: Boolean,
  priority: String (low/medium/high),
  category: String,
  dueDate: Date,
  tags: [String],
  notes: String,
  userId: ObjectId (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Features in Detail

### Search & Filter

- Search by title or description in real-time
- Filter by status (All, Active, Completed)
- Filter by category
- Sort by date, priority, due date, or alphabetically

### Statistics Dashboard

- Total todos count
- Active (incomplete) todos
- Completed todos
- Urgent (high priority incomplete) todos
- Completion percentage with visual progress bar

### Dark Mode

- Toggle between light and dark themes
- Preference saved to localStorage
- Smooth transitions

### Bulk Actions

- Select multiple todos with checkboxes
- Mark selected todos as complete
- Delete selected todos in batch

### Visual Indicators

- **Overdue todos** - Red border and pulse animation
- **Priority badges** - Color-coded circles (low=green, medium=orange, high=red)
- **Completion progress** - Visual progress bar
- **Category badges** - Custom category labels

### Export

- Download all todos as JSON file
- Includes all metadata (dates, priorities, categories, etc.)

## Usage Tips

1. **Quick Add** - Type in the search box and click "Add" for quick tasks
2. **Advanced** - Click the settings button to access description, priority, category, and due date fields
3. **Organize** - Use categories to group related tasks
4. **Prioritize** - Mark important tasks as high priority for easy tracking
5. **Track** - Check the statistics dashboard to monitor progress

## Responsive Breakpoints

- **Desktop** - Full-width layout with all features
- **Tablet (768px and below)** - Adjusted spacing and layout
- **Mobile (600px and below)** - Single-column layout, optimized touch targets

## Notes

- Currently no authentication (open for all users)
- All todos stored in shared MongoDB
- User-specific features can be added later

## Future Enhancements

- User authentication and authorization
- Todo sharing and collaboration
- Recurring tasks
- Todo templates
- Integration with calendar
- Task reminders and notifications
- Rich text editor for descriptions
- Attachments support
- Todo history and revisions

## Development

### Project Structure

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
