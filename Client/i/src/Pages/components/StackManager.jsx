import React, { useState } from "react";
import { ChevronDownIcon, PlusIcon, MoreIcon } from "./Icons";
import "./StackManager.css";

const StackManager = ({
  stacks,
  selectedStack,
  onSelectStack,
  onCreateStack,
  onDeleteStack,
  onToggleExpanded,
  onPinStack,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStackName, setNewStackName] = useState("");
  const [newStackColor, setNewStackColor] = useState("blue");
  const [newStackIcon, setNewStackIcon] = useState("📚");
  const [expandedMenu, setExpandedMenu] = useState(null);

  const stackColors = [
    { name: "red", color: "#ff6b6b" },
    { name: "orange", color: "#ffa94d" },
    { name: "yellow", color: "#ffd43b" },
    { name: "green", color: "#69db7c" },
    { name: "blue", color: "#74c0fc" },
    { name: "purple", color: "#b197fc" },
    { name: "pink", color: "#ff8787" },
    { name: "gray", color: "#a6adba" },
  ];

  const stackIcons = ["📚", "🎯", "💼", "🎨", "🚀", "💡", "📋", "🎓"];

  const handleCreateStack = () => {
    if (newStackName.trim()) {
      onCreateStack({
        name: newStackName,
        color: newStackColor,
        icon: newStackIcon,
      });
      setNewStackName("");
      setNewStackColor("blue");
      setNewStackIcon("📚");
      setShowCreateForm(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleCreateStack();
    } else if (e.key === "Escape") {
      setShowCreateForm(false);
    }
  };

  const sortedStacks = [...stacks].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return b.isPinned - a.isPinned;
    }
    return a.order - b.order;
  });

  return (
    <div className="stack-manager">
      <div className="stack-header">
        <h3>📚 Stacks</h3>
        <button
          className="add-stack-btn"
          onClick={() => setShowCreateForm(true)}
          title="Create new stack"
        >
          <PlusIcon />
        </button>
      </div>

      {showCreateForm && (
        <div className="create-stack-form">
          <input
            type="text"
            value={newStackName}
            onChange={(e) => setNewStackName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Stack name..."
            autoFocus
            className="stack-input"
          />

          <div className="icon-selector">
            {stackIcons.map((icon) => (
              <button
                key={icon}
                className={`icon-btn ${newStackIcon === icon ? "active" : ""}`}
                onClick={() => setNewStackIcon(icon)}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="color-selector">
            {stackColors.map((color) => (
              <button
                key={color.name}
                className={`color-btn ${newStackColor === color.name ? "active" : ""}`}
                style={{ backgroundColor: color.color }}
                onClick={() => setNewStackColor(color.name)}
                title={color.name}
              />
            ))}
          </div>

          <div className="form-buttons">
            <button
              className="btn-create"
              onClick={handleCreateStack}
              disabled={!newStackName.trim()}
            >
              Create
            </button>
            <button
              className="btn-cancel"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="stacks-list">
        {sortedStacks.length === 0 ? (
          <p className="empty-stacks">No stacks yet. Create your first!</p>
        ) : (
          sortedStacks.map((stack) => (
            <div key={stack._id} className="stack-item">
              <div
                className={`stack-header-item ${
                  selectedStack === stack._id ? "active" : ""
                }`}
                onClick={() => onSelectStack(stack._id)}
              >
                <button
                  className="expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpanded(stack._id);
                  }}
                >
                  <ChevronDownIcon
                    style={{
                      transform: stack.isExpanded
                        ? "rotate(0deg)"
                        : "rotate(-90deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                <span
                  className="stack-icon"
                  style={{
                    color: `var(--stack-${stack.color})`,
                  }}
                >
                  {stack.icon}
                </span>

                <span className="stack-name">{stack.name}</span>
                <span className="stack-count">{stack.notes.length}</span>

                <div className="stack-actions">
                  <button
                    className="pin-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinStack(stack._id);
                    }}
                    title={stack.isPinned ? "Unpin" : "Pin"}
                  >
                    {stack.isPinned ? "📌" : "📍"}
                  </button>

                  <button
                    className="menu-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedMenu(
                        expandedMenu === stack._id ? null : stack._id,
                      );
                    }}
                  >
                    <MoreIcon />
                  </button>

                  {expandedMenu === stack._id && (
                    <div className="stack-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStack(stack._id);
                          setExpandedMenu(null);
                        }}
                        className="delete-option"
                      >
                        Delete Stack
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {stack.isExpanded && stack.notes.length > 0 && (
                <div className="stack-notes">
                  {stack.notes.slice(0, 3).map((note) => (
                    <div key={note._id} className="stack-note-preview">
                      <div
                        className="note-color-dot"
                        style={{
                          backgroundColor: `var(--color-${note.color})`,
                        }}
                      />
                      <span className="note-title">{note.title}</span>
                      {note.isFavorited && (
                        <span className="favorite-badge">❤️</span>
                      )}
                    </div>
                  ))}
                  {stack.notes.length > 3 && (
                    <div className="stack-note-more">
                      +{stack.notes.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StackManager;
