import "./TodoForm.css";
import { useState } from "react";
import { AddIcon, SettingsIcon } from "./Icons";

export default function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [tags, setTags] = useState("");
  const [subtasksText, setSubtasksText] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("weekly");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (title.trim().length < 3) return;

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    const parsedSubtasks = subtasksText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({ title: line, completed: false }));

    onAddTodo({
      title: title.trim(),
      description,
      priority,
      category: category || null,
      dueDate: dueDate || null,
      reminderAt: reminderAt || null,
      tags: parsedTags,
      subtasks: parsedSubtasks,
      recurring: isRecurring
        ? { isRecurring: true, frequency: recurringFrequency }
        : { isRecurring: false },
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("");
    setDueDate("");
    setReminderAt("");
    setTags("");
    setSubtasksText("");
    setIsRecurring(false);
    setRecurringFrequency("weekly");
    setShowAdvanced(false);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-row">
        <input
          type="text"
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input main-input"
          minLength={3}
          required
        />
        <button type="submit" className="submit-btn">
          <AddIcon /> Add
        </button>
        <button
          type="button"
          className="toggle-advanced"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SettingsIcon />
        </button>
      </div>

      {showAdvanced && (
        <div className="advanced-form">
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows="2"
          />

          <div className="form-grid">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                placeholder="Work, Personal, etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Reminder</label>
              <input
                type="datetime-local"
                value={reminderAt}
                onChange={(e) => setReminderAt(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input
                type="text"
                placeholder="frontend, urgent"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Recurring Task</label>
              <select
                value={isRecurring ? recurringFrequency : "none"}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "none") {
                    setIsRecurring(false);
                  } else {
                    setIsRecurring(true);
                    setRecurringFrequency(value);
                  }
                }}
                className="form-select"
              >
                <option value="none">Not recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <textarea
            placeholder="Subtasks (one per line)"
            value={subtasksText}
            onChange={(e) => setSubtasksText(e.target.value)}
            className="form-textarea"
            rows="3"
          />
        </div>
      )}
    </form>
  );
}
