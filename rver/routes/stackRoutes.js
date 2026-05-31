const express = require("express");
const {
  createStack,
  getStacks,
  getStackDetail,
  updateStack,
  deleteStack,
  addNoteToStack,
  removeNoteFromStack,
  reorderStacks,
  toggleStackExpanded,
  getUnstackedNotes,
} = require("../controllers/stackController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware);

// Stack CRUD routes
router.post("/", createStack);
router.get("/", getStacks);
router.get("/unstacked", getUnstackedNotes);
router.get("/:stackId", getStackDetail);
router.patch("/:stackId", updateStack);
router.delete("/:stackId", deleteStack);

// Stack note management routes
router.post("/:stackId/notes/:noteId", addNoteToStack);
router.delete("/:stackId/notes/:noteId", removeNoteFromStack);

// Stack reordering and toggle routes
router.patch("/:stackId/toggle-expanded", toggleStackExpanded);
router.post("/reorder", reorderStacks);

module.exports = router;
