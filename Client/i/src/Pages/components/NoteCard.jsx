import { useState } from "react";
import "./NoteCard.css";
import {
  PinIcon,
  DeleteIcon,
  ArchiveIcon,
  EditIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon,
} from "./Icons";

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleArchive,
  isEditing,
  editFormData,
  onSaveEdit,
  onCancelEdit,
}) {
  const [editTitle, setEditTitle] = useState(editFormData?.title || note.title);
  const [editContent, setEditContent] = useState(
    editFormData?.content || note.content,
  );
  const [editColor, setEditColor] = useState(editFormData?.color || note.color);

  const handleSave = () => {
    onSaveEdit(note._id, editTitle, editContent, editColor);
  };

  if (isEditing) {
    return (
      <div className={`note-card editing color-${editColor}`}>
        <input
          type="text"
          className="edit-title"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="edit-content"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="Content"
          rows={6}
        />
        <div className="edit-footer">
          <div className="color-picker">
            {["yellow", "blue", "green", "pink", "purple"].map((c) => (
              <button
                key={c}
                type="button"
                className={`color-option color-${c} ${
                  editColor === c ? "selected" : ""
                }`}
                onClick={() => setEditColor(c)}
                title={c}
              />
            ))}
          </div>
          <div className="edit-actions">
            <button className="btn btn-cancel" onClick={onCancelEdit}>
              Cancel
            </button>
            <button className="btn btn-save" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  const truncateText = (text, lines = 3) => {
    const lineArray = text.split("\n");
    return lineArray.slice(0, lines).join("\n");
  };

  return (
    <div className={`note-card color-${note.color}`}>
      <div className="note-header">
        <h3 className="note-title">{note.title || "Untitled"}</h3>
        {note.isPinned && (
          <span className="pin-badge" title="Pinned">
            <PinIcon />
          </span>
        )}
      </div>

      <div className="note-body">
        {/* Priority Badge */}
        {note.priority && note.priority !== "medium" && (
          <div className={`priority-badge priority-${note.priority}`}>
            {note.priority.toUpperCase()}
          </div>
        )}

        {/* Images */}
        {note.images && note.images.length > 0 && (
          <div className="note-images">
            {note.images.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`note-image-${idx}`}
                className="note-image"
              />
            ))}
            {note.images.length > 3 && (
              <div className="image-overflow">+{note.images.length - 3}</div>
            )}
          </div>
        )}

        {/* Content */}
        <p className="note-content">{truncateText(note.content, 3)}</p>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.map((tag, idx) => (
              <span key={idx} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Due Date */}
        {note.reminder?.dueDate && (
          <div className="due-date-badge">
            <CalendarIcon />
            {new Date(note.reminder.dueDate).toLocaleDateString()}
          </div>
        )}

        {/* Category */}
        {note.category && <div className="category-badge">{note.category}</div>}

        {/* Stack */}
        {note.stack && (
          <div
            className="stack-badge"
            style={{ color: `var(--stack-${note.stack.color})` }}
          >
            {note.stack.icon} {note.stack.name}
          </div>
        )}
      </div>

      <div className="note-footer">
        <span className="note-date">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
        <div className="note-actions">
          <button
            className={`note-action-btn ${note.isFavorited ? "favorited" : ""}`}
            onClick={() => onToggleFavorite?.(note._id)}
            title={note.isFavorited ? "Unfavorite" : "Favorite"}
          >
            <HeartIcon />
          </button>
          <button
            className="note-action-btn"
            onClick={() => onTogglePin(note._id)}
            title={note.isPinned ? "Unpin" : "Pin"}
          >
            <PinIcon />
          </button>
          <button
            className="note-action-btn"
            onClick={() => onEdit(note)}
            title="Edit"
          >
            <EditIcon />
          </button>
          <button
            className="note-action-btn"
            onClick={() => onShare?.(note._id)}
            title="Share"
          >
            <ShareIcon />
          </button>
          <button
            className="note-action-btn"
            onClick={() => onToggleArchive(note._id)}
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            <ArchiveIcon />
          </button>
          <button
            className="note-action-btn delete"
            onClick={() => onDelete(note._id)}
            title="Delete"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
