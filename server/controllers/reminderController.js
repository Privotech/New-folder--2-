const Reminder = require("../models/Reminder");

// Get all reminders
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id })
      .populate("todoId", "title")
      .populate("noteId", "title")
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get active reminders
exports.getActiveReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.user.id,
      isActive: true,
      isCompleted: false,
    })
      .populate("todoId", "title")
      .populate("noteId", "title")
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single reminder
exports.getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create reminder
exports.createReminder = async (req, res) => {
  try {
    const {
      title,
      description,
      reminderDate,
      reminderTime,
      frequency,
      notificationType,
      todoId,
      noteId,
    } = req.body;

    if (!title || !reminderDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and reminder date",
      });
    }

    const reminder = await Reminder.create({
      title,
      description,
      reminderDate,
      reminderTime,
      frequency,
      notificationType,
      todoId,
      noteId,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update reminder
exports.updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete reminder
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Reminder.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Reminder deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Complete reminder
exports.completeReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    reminder.isCompleted = true;
    reminder.completedAt = Date.now();

    // Handle recurring reminders
    if (reminder.frequency !== "once") {
      const newReminder = new Reminder({
        ...reminder.toObject(),
        _id: undefined,
        reminderDate: calculateNextReminderDate(
          reminder.reminderDate,
          reminder.frequency,
        ),
        isCompleted: false,
        completedAt: null,
      });
      await newReminder.save();
    }

    await reminder.save();

    res.status(200).json({
      success: true,
      reminder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function to calculate next reminder date
function calculateNextReminderDate(currentDate, frequency) {
  const date = new Date(currentDate);

  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date;
}
