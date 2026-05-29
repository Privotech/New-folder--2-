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
    category: {
      type: String,
      enum: ["work", "personal", "ideas", "research", "archived"],
      default: "personal",
    },
    color: {
      type: String,
      enum: ["yellow", "blue", "green", "pink", "purple"],
      default: "yellow",
    },
    tags: [String],
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    isFavorited: { type: Boolean, default: false },
    images: [
      {
        publicId: String, // Cloudinary public ID
        url: String,
        width: Number,
        height: Number,
        uploadedAt: { type: Date, default: Date.now },
        caption: String,
      },
    ],
    attachments: [
      {
        filename: String,
        url: String,
        publicId: String,
        type: String,
        size: Number,
        uploadedAt: Date,
      },
    ],
    reminder: {
      isSet: { type: Boolean, default: false },
      dueDate: Date,
      frequency: {
        type: String,
        enum: ["once", "daily", "weekly", "monthly"],
        default: "once",
      },
      notificationSent: { type: Boolean, default: false },
    },
    collaborators: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        email: String,
        role: { type: String, enum: ["viewer", "editor"], default: "viewer" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    isShared: { type: Boolean, default: false },
    shareLink: String,
    shareExpiry: Date,
    sharedWith: [
      {
        email: String,
        role: String,
        accessedAt: Date,
      },
    ],
    template: {
      isTemplate: { type: Boolean, default: false },
      templateId: mongoose.Schema.Types.ObjectId,
      templateName: String,
    },
    version: { type: Number, default: 1 },
    history: [
      {
        content: String,
        title: String,
        editedBy: mongoose.Schema.Types.ObjectId,
        editedAt: { type: Date, default: Date.now },
        changesSummary: String,
      },
    ],
    checkList: [
      {
        item: String,
        completed: Boolean,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    voiceNoteUrl: String,
    voiceNoteDuration: Number,
    codeSnippets: [
      {
        language: String,
        code: String,
        title: String,
      },
    ],
    aiSummary: String,
    aiTags: [String],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    labels: [String],
    stackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stack",
      default: null,
    },
  },
  { timestamps: true },
);

noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, isPinned: -1 });
noteSchema.index({ tags: 1 });

module.exports = mongoose.model("Note", noteSchema);
