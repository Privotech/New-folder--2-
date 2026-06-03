const Project = require("../models/Project");
const Todo = require("../models/Todo");

// Get all projects for user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { "members.userId": req.user.id }],
    })
      .populate("owner", "username email")
      .populate("members.userId", "username email");

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "username email")
      .populate("members.userId", "username email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const isMember =
      project.owner.toString() === req.user.id ||
      project.members.some((m) => m.userId.toString() === req.user.id);

    if (!isMember && project.privacy === "private") {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create project
exports.createProject = async (req, res) => {
  try {
    const { name, description, color, privacy } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide project name",
      });
    }

    const project = await Project.create({
      name,
      description,
      color,
      privacy,
      owner: req.user.id,
      members: [
        {
          userId: req.user.id,
          role: "owner",
        },
      ],
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Only owner can update project",
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Only owner can delete project",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add member to project
exports.addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Only owner can add members",
      });
    }

    const memberExists = project.members.some(
      (m) => m.userId.toString() === userId,
    );
    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }

    project.members.push({
      userId,
      role: role || "viewer",
    });

    await project.save();

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove member from project
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Only owner can remove members",
      });
    }

    project.members = project.members.filter(
      (m) => m.userId.toString() !== userId,
    );

    await project.save();

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
