const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      default: null,
      trim: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    dueDate: {
      type: Date,
      default: null,
    },
    reminderAt: {
      type: Date,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    tags: {
      type: [String],
      default: [],
    },
    notes: {
      type: String,
      default: "",
    },
    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "biweekly", "monthly", "yearly"],
      },
      endDate: Date,
      daysOfWeek: [Number],
      parentTaskId: mongoose.Schema.Types.ObjectId,
    },
    subtasks: [
      {
        title: String,
        completed: Boolean,
      },
    ],
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    estimatedTime: Number,
    actualTime: Number,
  },
  { timestamps: true },
);

// Index for faster queries
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ projectId: 1, completed: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ reminderAt: 1 });
todoSchema.index({ "recurring.isRecurring": 1 });

module.exports = mongoose.model("Todo", todoSchema);
