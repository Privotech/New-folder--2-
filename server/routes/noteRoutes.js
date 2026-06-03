const express = require("express");
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  archiveNote,
  toggleFavorite,
  shareNote,
  getNoteHistory,
  getNotesByCategory,
  getFavorites,
  searchNotes,
} = require("../controllers/noteController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

// Basic CRUD
router.get("/", getNotes);
router.post("/", createNote);
router.get("/search", searchNotes);
router.get("/favorites", getFavorites);
router.get("/category/:category", getNotesByCategory);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// Advanced Features
router.patch("/:id/pin", togglePin);
router.patch("/:id/archive", archiveNote);
router.patch("/:id/favorite", toggleFavorite);
router.post("/:id/share", shareNote);
router.get("/:id/history", getNoteHistory);

module.exports = router;
