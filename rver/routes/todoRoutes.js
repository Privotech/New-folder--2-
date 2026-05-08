const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/auth");

// All routes require authentication
router.use(authMiddleware);

router.get("/", todoController.getAllTodos);
router.get("/summary", todoController.getTodoSummary);
router.post("/", todoController.createTodo);
router.patch("/bulk-complete", todoController.bulkCompleteTodos);
router.get("/:id", todoController.getTodoById);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);
router.patch("/:id/toggle", todoController.toggleTodoComplete);

module.exports = router;
