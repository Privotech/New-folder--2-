const Todo = require("../models/Todo");

const getAllTodos = async (req, res) => {
  try {
    const { projectId, completed, priority } = req.query;

    let filter = { userId: req.user.id };

    if (projectId) filter.projectId = projectId;
    if (completed !== undefined) filter.completed = completed === "true";
    if (priority) filter.priority = priority;

    const todos = await Todo.find(filter)
      .populate("projectId", "name")
      .populate("assignedTo", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: todos.length,
      todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodoSummary = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const dueToday = todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      const due = new Date(todo.dueDate);
      const today = new Date();
      return due.toDateString() === today.toDateString();
    }).length;

    res.status(200).json({
      success: true,
      summary: {
        total,
        completed,
        active,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
        dueToday,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("projectId")
      .populate("assignedTo", "username email");

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createTodo = async (req, res) => {
  const {
    title,
    description,
    priority,
    dueDate,
    category,
    tags,
    projectId,
    recurring,
    reminderAt,
    subtasks,
  } = req.body;

  const safeTitle = title?.trim();
  if (!safeTitle) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }

  const todo = new Todo({
    title: safeTitle,
    description,
    priority,
    dueDate,
    category,
    tags,
    projectId,
    recurring,
    reminderAt,
    subtasks: Array.isArray(subtasks) ? subtasks : [],
    userId: req.user.id,
  });

  try {
    const newTodo = await todo.save();
    await newTodo.populate("projectId").populate("assignedTo");

    res.status(201).json({
      success: true,
      todo: newTodo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "completed",
      "priority",
      "dueDate",
      "reminderAt",
      "category",
      "tags",
      "projectId",
      "assignedTo",
      "recurring",
      "subtasks",
      "actualTime",
    ];

    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        if (field === "completed" && req.body[field]) {
          todo.completedAt = Date.now();
        }
        todo[field] = req.body[field];
      }
    });

    const updatedTodo = await todo.save();
    await updatedTodo.populate("projectId").populate("assignedTo");

    res.status(200).json({
      success: true,
      todo: updatedTodo,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleTodoComplete = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    if (todo.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    todo.completed = !todo.completed;

    if (todo.completed) {
      todo.completedAt = Date.now();
    } else {
      todo.completedAt = null;
    }

    const updatedTodo = await todo.save();
    await updatedTodo.populate("projectId").populate("assignedTo");

    res.status(200).json({
      success: true,
      todo: updatedTodo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const bulkCompleteTodos = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || !ids.length) {
      return res.status(400).json({
        success: false,
        message: "A non-empty ids array is required",
      });
    }

    const result = await Todo.updateMany(
      { _id: { $in: ids }, userId: req.user.id },
      { completed: true, completedAt: Date.now() },
    );

    res.status(200).json({
      success: true,
      matched: result.matchedCount ?? result.n,
      modified: result.modifiedCount ?? result.nModified,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllTodos,
  getTodoSummary,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
  bulkCompleteTodos,
};
