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
} = require("../controllers/noteController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", getNotes);
router.post("/", createNote);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/pin", togglePin);
router.patch("/:id/archive", archiveNote);

module.exports = router;
