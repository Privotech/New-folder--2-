const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const noteRoutes = require("./routes/noteRoutes");
const projectRoutes = require("./routes/projectRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const stackRoutes = require("./routes/stackRoutes");

const port = process.env.PORT || 5001;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to PrivoKeep API!",
    version: "1.0",
    modules: ["auth", "notes", "projects", "reminders", "stacks"],
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/stacks", stackRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`PrivoKeep v1.0 Active`);
});
