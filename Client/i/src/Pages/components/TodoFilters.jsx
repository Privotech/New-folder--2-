import "./TodoFilters.css";

export default function TodoFilters({
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  categories,
  todos,
}) {
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="filters-container">
      <div className="filter-group">
        <label>Status:</label>
        <button
          className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${activeFilter === "active" ? "active" : ""}`}
          onClick={() => onFilterChange("active")}
        >
          Active ({activeCount})
        </button>
        <button
          className={`filter-btn ${activeFilter === "completed" ? "active" : ""}`}
          onClick={() => onFilterChange("completed")}
        >
          Done ({completedCount})
        </button>
      </div>

      <div className="filter-group">
        <label>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="date">Newest First</option>
          <option value="priority">By Priority</option>
          <option value="duedate">By Due Date</option>
          <option value="reminder">By Reminder Time</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {categories.length > 0 && (
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="category-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
