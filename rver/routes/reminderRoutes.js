const express = require("express");
const router = express.Router();
const {
  getReminders,
  getActiveReminders,
  getReminder,
  createReminder,
  updateReminder,
  deleteReminder,
  completeReminder,
} = require("../controllers/reminderController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/", getReminders);
router.get("/active/list", getActiveReminders);
router.post("/", createReminder);
router.get("/:id", getReminder);
router.put("/:id", updateReminder);
router.delete("/:id", deleteReminder);
router.patch("/:id/complete", completeReminder);

module.exports = router;
