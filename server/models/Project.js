const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["owner", "editor", "viewer"],
          default: "viewer",
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    color: {
      type: String,
      default: "#1abc9c",
    },
    icon: String,
    isArchived: { type: Boolean, default: false },
    taskCount: { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 },
    privacy: {
      type: String,
      enum: ["private", "shared"],
      default: "private",
    },
  },
  { timestamps: true },
);

projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ "members.userId": 1 });

module.exports = mongoose.model("Project", projectSchema);
