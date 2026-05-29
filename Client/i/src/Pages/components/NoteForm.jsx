import { useState } from "react";
import "./NoteForm.css";
import { ImageUploader } from "./ImageUploader";

export default function NoteForm({ onSubmit, loading, stacks = [] }) {
  const [isFocused, setIsFocused] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [category, setCategory] = useState("personal");
  const [tags, setTags] = useState("");
  const [images, setImages] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [stackId, setStackId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() || content.trim()) {
      onSubmit({
        title,
        content,
        color,
        category,
        tags: tags.split(",").filter((t) => t.trim()),
        images,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        stackId: stackId || null,
      });
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setColor("yellow");
    setCategory("personal");
    setTags("");
    setImages([]);
    setPriority("medium");
    setDueDate("");
    setStackId("");
    setIsFocused(false);
    setShowAdvanced(false);
  };

  const handleImagesUpload = (uploadedImages) => {
    setImages([...images, ...uploadedImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form className="note-form-container" onSubmit={handleSubmit}>
      <div className={`note-form ${isFocused ? "focused" : ""} color-${color}`}>
        <input
          type="text"
          className="note-title-input"
          placeholder="Add a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />

        {isFocused && (
          <>
            <textarea
              className="note-content-input"
              placeholder="Take a note... You can use text, images, and more!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="image-preview-item">
                    <img src={img.url} alt={`upload-${idx}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(idx)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="note-form-toolbar">
              <ImageUploader onImagesUpload={handleImagesUpload} />

              <button
                type="button"
                className="btn-advanced-toggle"
                onClick={() => setShowAdvanced(!showAdvanced)}
                title="Advanced options"
              >
                ⚙️ Advanced
              </button>
            </div>

            {showAdvanced && (
              <div className="advanced-options">
                <div className="option-group">
                  <label>Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                    <option value="ideas">Ideas</option>
                    <option value="research">Research</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>Priority:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>Stack:</label>
                  <select
                    value={stackId}
                    onChange={(e) => setStackId(e.target.value)}
                  >
                    <option value="">No Stack</option>
                    {stacks.map((stack) => (
                      <option key={stack._id} value={stack._id}>
                        {stack.icon} {stack.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="option-group">
                  <label>Due Date:</label>
                  <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="option-group">
                  <label>Tags (comma-separated):</label>
                  <input
                    type="text"
                    placeholder="e.g., urgent, review, important"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="note-form-footer">
              <div className="color-picker">
                {["yellow", "blue", "green", "pink", "purple"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-option color-${c} ${
                      color === c ? "selected" : ""
                    }`}
                    onClick={() => setColor(c)}
                    title={c}
                  />
                ))}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={resetForm}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-save"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
