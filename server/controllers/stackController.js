const Stack = require("../models/Stack");
const Note = require("../models/Note");

// Create a new stack
exports.createStack = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Stack name is required" });
    }

    const stack = new Stack({
      name,
      description,
      color: color || "blue",
      icon: icon || "📚",
      userId,
      notes: [],
    });

    await stack.save();
    res.status(201).json({
      success: true,
      message: "Stack created successfully",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all stacks for user
exports.getStacks = async (req, res) => {
  try {
    const userId = req.user.id;

    const stacks = await Stack.find({ userId })
      .populate("notes", "title content color category priority isFavorited")
      .sort({ isPinned: -1, order: 1, createdAt: -1 });

    res.json({
      success: true,
      stacks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single stack with all notes
exports.getStackDetail = async (req, res) => {
  try {
    const { stackId } = req.params;
    const userId = req.user.id;

    const stack = await Stack.findOne({ _id: stackId, userId }).populate(
      "notes",
    );

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    res.json({
      success: true,
      stack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update stack
exports.updateStack = async (req, res) => {
  try {
    const { stackId } = req.params;
    const { name, description, color, icon, isExpanded, isPinned } = req.body;
    const userId = req.user.id;

    const stack = await Stack.findOneAndUpdate(
      { _id: stackId, userId },
      {
        $set: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(color && { color }),
          ...(icon && { icon }),
          ...(isExpanded !== undefined && { isExpanded }),
          ...(isPinned !== undefined && { isPinned }),
        },
      },
      { new: true },
    );

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    res.json({
      success: true,
      message: "Stack updated successfully",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete stack (notes remain, just remove stackId from them)
exports.deleteStack = async (req, res) => {
  try {
    const { stackId } = req.params;
    const userId = req.user.id;

    const stack = await Stack.findOne({ _id: stackId, userId });

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    // Remove stackId from all notes in this stack
    if (stack.notes.length > 0) {
      await Note.updateMany({ stackId: stackId }, { $set: { stackId: null } });
    }

    await Stack.deleteOne({ _id: stackId });

    res.json({
      success: true,
      message: "Stack deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add note to stack
exports.addNoteToStack = async (req, res) => {
  try {
    const { stackId, noteId } = req.params;
    const userId = req.user.id;

    const stack = await Stack.findOne({ _id: stackId, userId });

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // If note is already in another stack, remove it from there
    if (note.stackId && note.stackId.toString() !== stackId) {
      await Stack.updateOne(
        { _id: note.stackId },
        { $pull: { notes: noteId } },
      );
    }

    // Add to new stack if not already there
    if (!stack.notes.includes(noteId)) {
      stack.notes.push(noteId);
      await stack.save();
    }

    // Update note with stackId
    note.stackId = stackId;
    await note.save();

    res.json({
      success: true,
      message: "Note added to stack",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove note from stack
exports.removeNoteFromStack = async (req, res) => {
  try {
    const { stackId, noteId } = req.params;
    const userId = req.user.id;

    const stack = await Stack.findOne({ _id: stackId, userId });

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Remove from stack
    stack.notes = stack.notes.filter((id) => id.toString() !== noteId);
    await stack.save();

    // Update note
    note.stackId = null;
    await note.save();

    res.json({
      success: true,
      message: "Note removed from stack",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reorder stacks
exports.reorderStacks = async (req, res) => {
  try {
    const { stacks } = req.body;
    const userId = req.user.id;

    if (!stacks || !Array.isArray(stacks)) {
      return res.status(400).json({ message: "Invalid stacks data" });
    }

    // Update order for each stack
    for (let i = 0; i < stacks.length; i++) {
      await Stack.updateOne(
        { _id: stacks[i].id, userId },
        { $set: { order: i } },
      );
    }

    res.json({
      success: true,
      message: "Stacks reordered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle stack expand/collapse
exports.toggleStackExpanded = async (req, res) => {
  try {
    const { stackId } = req.params;
    const userId = req.user.id;

    const stack = await Stack.findOne({ _id: stackId, userId });

    if (!stack) {
      return res.status(404).json({ message: "Stack not found" });
    }

    stack.isExpanded = !stack.isExpanded;
    await stack.save();

    res.json({
      success: true,
      message: "Stack expanded state toggled",
      stack,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get notes not in any stack
exports.getUnstackedNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const notes = await Note.find({ userId, stackId: null })
      .sort({ createdAt: -1 })
      .select("title content color category priority");

    res.json({
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
