const mongoose = require("mongoose");

const stackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      enum: [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "pink",
        "gray",
      ],
      default: "blue",
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    isExpanded: {
      type: Boolean,
      default: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    icon: {
      type: String,
      default: "📚",
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
stackSchema.index({ userId: 1, createdAt: -1 });
stackSchema.index({ userId: 1, isPinned: -1, order: 1 });

module.exports = mongoose.model("Stack", stackSchema);
