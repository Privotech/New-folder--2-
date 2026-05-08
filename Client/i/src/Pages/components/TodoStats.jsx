import "./TodoStats.css";

const calculateStreak = (todos) => {
  const completedDays = new Set(
    todos
      .filter((todo) => todo.completedAt)
      .map((todo) => new Date(todo.completedAt).toDateString()),
  );
  let streak = 0;
  const cursor = new Date();
  while (completedDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export default function TodoStats({ todos, summary }) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((t) => t.completed).length;
  const activeTodos = todos.filter((t) => !t.completed).length;
  const highPriorityTodos = todos.filter(
    (t) => t.priority === "high" && !t.completed,
  ).length;
  const completionPercentage =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;
  const dueToday =
    summary?.dueToday ??
    todos.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      const due = new Date(todo.dueDate);
      const now = new Date();
      return due.toDateString() === now.toDateString();
    }).length;
  const streak = calculateStreak(todos);

  return (
    <div className="stats-container">
      <div className="stat-item">
        <span className="stat-label">Total</span>
        <span className="stat-value">{totalTodos}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Active</span>
        <span className="stat-value active">{activeTodos}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Done</span>
        <span className="stat-value done">{completedTodos}</span>
      </div>
      {highPriorityTodos > 0 && (
        <div className="stat-item">
          <span className="stat-label">Urgent</span>
          <span className="stat-value urgent">{highPriorityTodos}</span>
        </div>
      )}
      <div className="stat-item">
        <span className="stat-label">Due Today</span>
        <span className="stat-value due">{dueToday}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Streak</span>
        <span className="stat-value streak">{streak}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${completionPercentage}%` }}
        ></div>
        <span className="progress-text">{completionPercentage}%</span>
      </div>
    </div>
  );
}
