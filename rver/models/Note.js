const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is required"],
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    color: {
      type: String,
      enum: ["yellow", "blue", "green", "pink", "purple"],
      default: "yellow",
    },
    tags: [String],
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    attachments: [
      {
        filename: String,
        url: String,
        type: String,
        uploadedAt: Date,
      },
    ],
    collaborators: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        role: { type: String, enum: ["viewer", "editor"] },
      },
    ],
  },
  { timestamps: true },
);

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, isPinned: -1 });
noteSchema.index({ tags: 1 });

module.exports = mongoose.model("Note", noteSchema);
