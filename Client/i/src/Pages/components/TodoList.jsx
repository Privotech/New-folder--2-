import "./TodoList.css";
import { DeleteIcon, DateIcon, LoadingIcon, PartyIcon } from "./Icons";

export default function TodoList({
  todos,
  loading,
  onToggle,
  onDelete,
  onToggleSubtask,
  onSelect,
  selectedTodos,
  onSelectAll,
  allSelected,
}) {
  if (loading) {
    return (
      <div className="loading">
        <LoadingIcon /> Loading your todos...
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty">
        <PartyIcon /> No todos! You're all caught up!
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && true;
  };

  return (
    <div className="todo-list-container">
      {selectedTodos.length > 0 && (
        <div className="list-header">
          <input
            type="checkbox"
            className="select-all-checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            title="Select all"
          />
          <span className="select-info">{selectedTodos.length} selected</span>
        </div>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`todo-item ${todo.completed ? "completed" : ""} ${
              isOverdue(todo.dueDate) && !todo.completed ? "overdue" : ""
            } ${selectedTodos.includes(todo._id) ? "selected" : ""}`}
          >
            <div className="todo-checkbox-wrapper">
              <input
                type="checkbox"
                className="select-checkbox"
                checked={selectedTodos.includes(todo._id)}
                onChange={() => onSelect(todo._id)}
              />
            </div>

            <div className="todo-content">
              <div className="todo-main">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => onToggle(todo._id)}
                  className="todo-checkbox"
                />
                <div className="todo-text">
                  <p className="todo-title">{todo.title}</p>
                  {todo.description && (
                    <p className="todo-description">{todo.description}</p>
                  )}
                </div>
              </div>

              <div className="todo-meta">
                {todo.category && (
                  <span className="category-badge">{todo.category}</span>
                )}
                {todo.tags?.map((tag) => (
                  <span key={`${todo._id}-${tag}`} className="tag-badge">
                    #{tag}
                  </span>
                ))}
                <span className={`priority-badge ${todo.priority}`}>
                  {todo.priority.charAt(0).toUpperCase()}
                </span>
                {todo.dueDate && (
                  <span
                    className={`due-date ${
                      isOverdue(todo.dueDate) && !todo.completed
                        ? "overdue"
                        : ""
                    }`}
                  >
                    <DateIcon /> {formatDate(todo.dueDate)}
                  </span>
                )}
                {todo.reminderAt && (
                  <span className="due-date">
                    Reminder: {formatDate(todo.reminderAt)}
                  </span>
                )}
                {todo.recurring?.isRecurring && todo.recurring?.frequency && (
                  <span className="recurring-badge">{todo.recurring.frequency}</span>
                )}
              </div>
              {todo.subtasks?.length > 0 && (
                <div className="subtasks">
                  {todo.subtasks.map((subtask, index) => (
                    <label
                      className={`subtask-row ${subtask.completed ? "done" : ""}`}
                      key={`${todo._id}-subtask-${index}`}
                    >
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onToggleSubtask(todo._id, index)}
                      />
                      <span>{subtask.title}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onDelete(todo._id)}
              className="delete-btn"
              title="Delete"
            >
              <DeleteIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
