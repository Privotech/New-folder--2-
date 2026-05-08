import { useState, useEffect } from "react";
import "./TodoApp.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoStats from "./components/TodoStats";
import TodoFilters from "./components/TodoFilters";
import AuthPanel from "./components/AuthPanel";
import {
  TodoIcon,
  ExportIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
  DeleteIcon,
} from "./components/Icons";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const API_URL = "http://localhost:5001/api/todos";

  // Fetch todos on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (token) {
      loadCurrentUser();
    } else {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && authUser) {
      fetchTodos();
      fetchSummary();
    }
  }, [token, authUser]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...todos];

    // Status filter
    if (activeFilter === "active") {
      result = result.filter((todo) => !todo.completed);
    } else if (activeFilter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    // Category filter
    if (categoryFilter !== "all" && categoryFilter) {
      result = result.filter((todo) => todo.category === categoryFilter);
    }

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    // Sorting
    if (sortBy === "priority") {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      result.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      );
    } else if (sortBy === "duedate") {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === "reminder") {
      result.sort((a, b) => {
        if (!a.reminderAt) return 1;
        if (!b.reminderAt) return -1;
        return new Date(a.reminderAt) - new Date(b.reminderAt);
      });
    } else if (sortBy === "alphabetical") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredTodos(result);
  }, [todos, searchQuery, activeFilter, sortBy, categoryFilter]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const getHeaders = (includeJson = true) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (includeJson) headers["Content-Type"] = "application/json";
    return headers;
  };

  const showToast = (message) => setToast(message);

  const parseTodosResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.todos)) return data.todos;
    return [];
  };

  const parseSingleTodo = (data) => data?.todo || data;

  const loadCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/auth/me", {
        headers: getHeaders(false),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Authentication failed");
      }
      setAuthUser(data.user);
    } catch (error) {
      localStorage.removeItem("token");
      setToken("");
      setAuthUser(null);
      showToast("Session expired. Please sign in again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthSuccess = ({ token: nextToken, user }) => {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
    setAuthUser(user);
    showToast(`Welcome ${user.username}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setAuthUser(null);
    setTodos([]);
    setFilteredTodos([]);
    showToast("Signed out successfully");
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, { headers: getHeaders(false) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load todos");
      setTodos(parseTodosResponse(data));
    } catch (error) {
      showToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/summary`, {
        headers: getHeaders(false),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSummary(data.summary);
      }
    } catch (error) {
      // Keep summary optional to avoid blocking todo list usage.
    }
  };

  const addTodo = async (formData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add todo");
      const newTodo = parseSingleTodo(data);
      setTodos([newTodo, ...todos]);
      fetchSummary();
      showToast("Todo created");
    } catch (error) {
      showToast(error.message);
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update todo");
      const updatedTodo = parseSingleTodo(data);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      setEditingId(null);
      fetchSummary();
    } catch (error) {
      showToast(error.message);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/toggle`, {
        method: "PATCH",
        headers: getHeaders(false),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to toggle todo");
      const updatedTodo = parseSingleTodo(data);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
      fetchSummary();
    } catch (error) {
      showToast(error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(false),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete todo");
      setTodos(todos.filter((todo) => todo._id !== id));
      setSelectedTodos(selectedTodos.filter((sid) => sid !== id));
      fetchSummary();
    } catch (error) {
      showToast(error.message);
    }
  };

  const deleteSelectedTodos = async () => {
    for (const id of selectedTodos) {
      await deleteTodo(id);
    }
    showToast("Selected todos deleted");
  };

  const markSelectedCompleted = async () => {
    try {
      const response = await fetch(`${API_URL}/bulk-complete`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ ids: selectedTodos }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Bulk complete failed");
      setTodos((prev) =>
        prev.map((todo) =>
          selectedTodos.includes(todo._id)
            ? { ...todo, completed: true, completedAt: new Date().toISOString() }
            : todo,
        ),
      );
      fetchSummary();
      showToast("Selected todos marked complete");
    } catch (error) {
      showToast(error.message);
    }
  };

  const toggleSubtask = async (todoId, subtaskIndex) => {
    const todo = todos.find((item) => item._id === todoId);
    if (!todo?.subtasks?.length) return;
    const updatedSubtasks = todo.subtasks.map((subtask, index) =>
      index === subtaskIndex
        ? { ...subtask, completed: !subtask.completed }
        : subtask,
    );
    await updateTodo(todoId, { subtasks: updatedSubtasks });
  };

  const toggleSelectTodo = (id) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedTodos.length === filteredTodos.length) {
      setSelectedTodos([]);
    } else {
      setSelectedTodos(filteredTodos.map((t) => t._id));
    }
  };

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `todos-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  const getCategories = () => {
    const categories = new Set(todos.map((t) => t.category).filter(Boolean));
    return Array.from(categories);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  return (
    <div className={`todo-app ${darkMode ? "dark" : "light"}`}>
      <div className="todo-container">
        {toast && <div className="toast">{toast}</div>}
        {authLoading ? (
          <div className="loading">Checking session...</div>
        ) : !authUser ? (
          <AuthPanel onAuthSuccess={handleAuthSuccess} />
        ) : (
          <>
        <div className="app-header">
          <div className="header-content">
            <h1>
              <TodoIcon /> My Tasks
            </h1>
            <div className="header-actions">
              <button
                className="dark-mode-btn"
                onClick={toggleDarkMode}
                title={darkMode ? "Light Mode" : "Dark Mode"}
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <button className="dark-mode-btn" onClick={handleLogout} title="Logout">
                Logout
              </button>
            </div>
          </div>

          <TodoStats todos={todos} summary={summary} />
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={exportTodos} className="export-btn">
            <ExportIcon /> Export
          </button>
        </div>

        <TodoForm onAddTodo={addTodo} />

        <TodoFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          categories={getCategories()}
          todos={todos}
        />

        {selectedTodos.length > 0 && (
          <div className="bulk-actions">
            <span>{selectedTodos.length} selected</span>
            <button onClick={markSelectedCompleted} className="bulk-complete">
              <CheckIcon /> Mark Complete
            </button>
            <button onClick={deleteSelectedTodos} className="bulk-delete">
              <DeleteIcon /> Delete
            </button>
          </div>
        )}

        <TodoList
          todos={filteredTodos}
          loading={loading}
          onToggle={toggleTodo}
          onToggleSubtask={toggleSubtask}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
          onSelect={toggleSelectTodo}
          selectedTodos={selectedTodos}
          editingId={editingId}
          onStartEdit={(todo) => {
            setEditingId(todo._id);
            setEditFormData(todo);
          }}
          onCancelEdit={() => setEditingId(null)}
          onSaveEdit={(todo, updates) => updateTodo(todo._id, updates)}
          onSelectAll={toggleSelectAll}
          allSelected={
            selectedTodos.length === filteredTodos.length &&
            filteredTodos.length > 0
          }
        />
          </>
        )}
      </div>
    </div>
  );
}
