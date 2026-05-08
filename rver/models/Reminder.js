const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Reminder title is required"],
    },
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    todoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    reminderTime: String,
    frequency: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly", "yearly"],
      default: "once",
    },
    isActive: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    notificationType: {
      type: String,
      enum: ["in-app", "email", "both"],
      default: "in-app",
    },
    completedAt: Date,
  },
  { timestamps: true },
);

reminderSchema.index({ userId: 1, reminderDate: 1 });
reminderSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("Reminder", reminderSchema);
