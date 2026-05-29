const Note = require("../models/Note");

// Get all notes for user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (
      note.userId.toString() !== req.user.id &&
      !note.collaborators.some((c) => c.userId.toString() === req.user.id)
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create note - Enhanced
exports.createNote = async (req, res) => {
  try {
    const {
      title,
      content,
      color,
      category,
      priority,
      tags,
      images,
      dueDate,
      projectId,
    } = req.body;

    if (!title && !content && (!images || images.length === 0)) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, content, or images",
      });
    }

    const note = await Note.create({
      title: title || "Untitled",
      content: content || "",
      color: color || "yellow",
      category: category || "personal",
      priority: priority || "medium",
      tags: tags || [],
      images: images || [],
      userId: req.user.id,
      projectId,
      reminder: dueDate
        ? {
            isSet: true,
            dueDate: new Date(dueDate),
            frequency: "once",
          }
        : {
            isSet: false,
          },
      version: 1,
    });

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update note - Enhanced
exports.updateNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Store previous version in history
    if (note.content !== req.body.content || note.title !== req.body.title) {
      note.history.push({
        content: note.content,
        title: note.title,
        editedBy: req.user.id,
        editedAt: new Date(),
        changesSummary: `Updated ${
          note.title !== req.body.title ? "title" : ""
        } ${note.content !== req.body.content ? "content" : ""}`,
      });
      note.version += 1;
    }

    // Update fields
    const allowedFields = [
      "title",
      "content",
      "color",
      "category",
      "priority",
      "tags",
      "images",
      "reminder",
      "isFavorited",
      "labels",
      "checkList",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        note[field] = req.body[field];
      }
    });

    await note.save();

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Pin/Unpin note
exports.togglePin = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Archive note
exports.archiveNote = async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    note.isFavorited = !note.isFavorited;
    await note.save();

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Share note
exports.shareNote = async (req, res) => {
  try {
    const { email, role } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    // Check if already shared with this email
    const existingShare = note.collaborators.find((c) => c.email === email);
    if (existingShare) {
      return res.status(400).json({
        success: false,
        message: "Already shared with this email",
      });
    }

    note.collaborators.push({
      email,
      role: role || "viewer",
      addedAt: new Date(),
    });

    note.isShared = true;
    await note.save();

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get note history
exports.getNoteHistory = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      history: note.history,
      version: note.version,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get notes by category
exports.getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const notes = await Note.find({
      userId: req.user.id,
      category: category,
    }).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get favorites
exports.getFavorites = async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id,
      isFavorited: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search notes
exports.searchNotes = async (req, res) => {
  try {
    const { query, category, priority } = req.query;

    const filter = { userId: req.user.id };

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (priority && priority !== "all") {
      filter.priority = priority;
    }

    const notes = await Note.find(filter).sort({
      isPinned: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
