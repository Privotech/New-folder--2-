"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Note, NoteColor, Stack, Todo, User } from "@/types";
import {
  getStoredNotes,
  saveNotes,
  getStoredStacks,
  saveStacks,
  getStoredTodos,
  saveTodos,
  getStoredUser,
  setStoredUser,
} from "@/lib/storage";
import { Navbar } from "@/components/Navbar";
import { AuthView } from "@/components/AuthView";
import { NoteForm } from "@/components/notes/NoteForm";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteSidebar } from "@/components/notes/NoteSidebar";
import { ShareModal } from "@/components/notes/ShareModal";
import { EditNoteModal } from "@/components/notes/EditNoteModal";
import { TodoStats } from "@/components/todos/TodoStats";
import { TodoForm } from "@/components/todos/TodoForm";
import { TodoFilters } from "@/components/todos/TodoFilters";
import { TodoList } from "@/components/todos/TodoList";
import { NeonConsole } from "@/components/neon/NeonConsole";
import { Pin, FileText, CheckCircle2, Database, Layers } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"notes" | "todos" | "neon">("notes");
  const [darkMode, setDarkMode] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [selectedStackId, setSelectedStackId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showImagesOnly, setShowImagesOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedColor, setSelectedColor] = useState<NoteColor | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [shareNote, setShareNote] = useState<Note | null>(null);
  const [editNote, setEditNote] = useState<Note | null>(null);

  // Todos state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoStatus, setTodoStatus] = useState<"all" | "active" | "completed">("all");
  const [todoCategory, setTodoCategory] = useState("all");
  const [todoPriority, setTodoPriority] = useState("all");
  const [todoSortBy, setTodoSortBy] = useState("date");
  const [selectedTodoIds, setSelectedTodoIds] = useState<string[]>([]);

  // Load initial settings and data
  useEffect(() => {
    setMounted(true);
    const currentUser = getStoredUser();
    setUser(currentUser);

    const savedDark = localStorage.getItem("darkMode");
    if (savedDark) {
      const isDark = JSON.parse(savedDark);
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add("dark");
    }

    if (currentUser) {
      setNotes(getStoredNotes(currentUser.id));
      setStacks(getStoredStacks(currentUser.id));
      setTodos(getStoredTodos(currentUser.id));
    }
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode, mounted]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  const handleLogout = () => {
    setStoredUser(null);
    setUser(null);
    showToast("Signed out successfully");
  };

  // --- Notes Operations ---
  const handleCreateNote = (noteData: Partial<Note>) => {
    if (!user) return;
    const newNote: Note = {
      _id: `note-${Date.now()}`,
      userId: user.id,
      title: noteData.title || "Untitled Note",
      content: noteData.content || "",
      color: noteData.color || "default",
      category: noteData.category || "personal",
      priority: noteData.priority || "medium",
      tags: noteData.tags || [],
      images: noteData.images || [],
      isPinned: !!noteData.isPinned,
      isArchived: false,
      isFavorited: false,
      stackId: noteData.stackId || selectedStackId || null,
      reminder: noteData.reminder || { isSet: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    saveNotes(updated);
    showToast("Note created successfully");
  };

  const handleTogglePinNote = (id: string) => {
    const updated = notes.map((n) => (n._id === id ? { ...n, isPinned: !n.isPinned } : n));
    setNotes(updated);
    saveNotes(updated);
  };

  const handleToggleArchiveNote = (id: string) => {
    const updated = notes.map((n) =>
      n._id === id ? { ...n, isArchived: !n.isArchived, isPinned: false } : n,
    );
    setNotes(updated);
    saveNotes(updated);
    showToast(
      updated.find((n) => n._id === id)?.isArchived
        ? "Note archived"
        : "Note restored from archive",
    );
  };

  const handleToggleFavoriteNote = (id: string) => {
    const updated = notes.map((n) => (n._id === id ? { ...n, isFavorited: !n.isFavorited } : n));
    setNotes(updated);
    saveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const updated = notes.filter((n) => n._id !== id);
    setNotes(updated);
    saveNotes(updated);
    showToast("Note deleted");
  };

  const handleChangeNoteColor = (id: string, color: NoteColor) => {
    const updated = notes.map((n) => (n._id === id ? { ...n, color } : n));
    setNotes(updated);
    saveNotes(updated);
  };

  const handleSaveEditedNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map((n) =>
      n._id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n,
    );
    setNotes(updated);
    saveNotes(updated);
    showToast("Note updated");
  };

  // --- Stacks Operations ---
  const handleCreateStack = (name: string) => {
    if (!user) return;
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newStack: Stack = {
      _id: `stack-${Date.now()}`,
      userId: user.id,
      name,
      color: randomColor,
      isPinned: false,
      isExpanded: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [...stacks, newStack];
    setStacks(updated);
    saveStacks(updated);
    showToast(`Stack "${name}" created`);
  };

  const handleDeleteStack = (id: string) => {
    const updatedStacks = stacks.filter((s) => s._id !== id);
    setStacks(updatedStacks);
    saveStacks(updatedStacks);

    // Unassign notes from this stack
    const updatedNotes = notes.map((n) => (n.stackId === id ? { ...n, stackId: null } : n));
    setNotes(updatedNotes);
    saveNotes(updatedNotes);

    if (selectedStackId === id) setSelectedStackId(null);
    showToast("Stack removed");
  };

  const handleTogglePinStack = (id: string) => {
    const updated = stacks.map((s) => (s._id === id ? { ...s, isPinned: !s.isPinned } : s));
    setStacks(updated);
    saveStacks(updated);
  };

  const handleMoveNoteToStack = (noteId: string, stackId: string | null) => {
    const targetNote = notes.find((n) => n._id === noteId);
    if (!targetNote) return;

    if (targetNote.stackId === stackId) {
      return;
    }

    const updated = notes.map((n) =>
      n._id === noteId ? { ...n, stackId, updatedAt: new Date().toISOString() } : n
    );
    setNotes(updated);
    saveNotes(updated);

    if (stackId) {
      const targetStack = stacks.find((s) => s._id === stackId);
      showToast(`Moved "${targetNote.title}" to stack "${targetStack?.name || "Stack"}"`);
    } else {
      showToast(`Removed "${targetNote.title}" from stack`);
    }
  };

  // Note counts by stack
  const noteCountsByStack = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach((n) => {
      if (n.stackId) {
        counts[n.stackId] = (counts[n.stackId] || 0) + 1;
      }
    });
    return counts;
  }, [notes]);

  // Filtered Notes
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Archive filter
      if (showArchived !== note.isArchived) return false;

      // Favorites
      if (showFavorites && !note.isFavorited) return false;

      // With Images
      if (showImagesOnly && (!note.images || note.images.length === 0)) return false;

      // Stack filter
      if (selectedStackId && note.stackId !== selectedStackId) return false;

      // Category filter
      if (selectedCategory !== "all" && note.category !== selectedCategory) return false;

      // Priority filter
      if (selectedPriority !== "all" && note.priority !== selectedPriority) return false;

      // Color filter
      if (selectedColor !== "all" && note.color !== selectedColor) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(q);
        const matchesContent = note.content.toLowerCase().includes(q);
        const matchesTags = note.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTags) return false;
      }

      return true;
    });
  }, [
    notes,
    showArchived,
    showFavorites,
    showImagesOnly,
    selectedStackId,
    selectedCategory,
    selectedPriority,
    selectedColor,
    searchQuery,
  ]);

  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.isPinned),
    [filteredNotes],
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.isPinned),
    [filteredNotes],
  );

  // --- Todos Operations ---
  const handleAddTodo = (todoData: Partial<Todo>) => {
    if (!user) return;
    const newTodo: Todo = {
      _id: `todo-${Date.now()}`,
      userId: user.id,
      title: todoData.title || "Untitled Task",
      description: todoData.description || "",
      priority: todoData.priority || "medium",
      category: todoData.category || "General",
      dueDate: todoData.dueDate,
      completed: false,
      subtasks: todoData.subtasks || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newTodo, ...todos];
    setTodos(updated);
    saveTodos(updated);
    showToast("Task created");
  };

  const handleToggleCompleteTodo = (id: string) => {
    const updated = todos.map((t) =>
      t._id === id
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : undefined,
          }
        : t,
    );
    setTodos(updated);
    saveTodos(updated);
  };

  const handleToggleSubtask = (todoId: string, subtaskIndex: number) => {
    const updated = todos.map((t) => {
      if (t._id === todoId && t.subtasks) {
        const newSubtasks = [...t.subtasks];
        newSubtasks[subtaskIndex] = {
          ...newSubtasks[subtaskIndex],
          completed: !newSubtasks[subtaskIndex].completed,
        };
        return { ...t, subtasks: newSubtasks };
      }
      return t;
    });
    setTodos(updated);
    saveTodos(updated);
  };

  const handleDeleteTodo = (id: string) => {
    const updated = todos.filter((t) => t._id !== id);
    setTodos(updated);
    saveTodos(updated);
    setSelectedTodoIds(selectedTodoIds.filter((sid) => sid !== id));
    showToast("Task deleted");
  };

  const handleToggleSelectTodo = (id: string) => {
    setSelectedTodoIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Filtered & Sorted Todos
  const filteredTodos = useMemo(() => {
    let result = todos.filter((t) => {
      if (todoStatus === "active" && t.completed) return false;
      if (todoStatus === "completed" && !t.completed) return false;
      if (todoCategory !== "all" && t.category !== todoCategory) return false;
      if (todoPriority !== "all" && t.priority !== todoPriority) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (todoSortBy === "priority") {
        const order = { high: 1, medium: 2, low: 3 };
        return order[a.priority] - order[b.priority];
      }
      if (todoSortBy === "duedate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (todoSortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [todos, todoStatus, todoCategory, todoPriority, todoSortBy, searchQuery]);

  const todoCategories = useMemo(() => {
    const set = new Set<string>();
    todos.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [todos]);

  const handleSelectAllVisible = () => {
    if (selectedTodoIds.length === filteredTodos.length) {
      setSelectedTodoIds([]);
    } else {
      setSelectedTodoIds(filteredTodos.map((t) => t._id));
    }
  };

  const handleBulkComplete = () => {
    const updated = todos.map((t) =>
      selectedTodoIds.includes(t._id)
        ? { ...t, completed: true, completedAt: new Date().toISOString() }
        : t,
    );
    setTodos(updated);
    saveTodos(updated);
    setSelectedTodoIds([]);
    showToast(`${selectedTodoIds.length} tasks marked complete`);
  };

  const handleBulkDelete = () => {
    const updated = todos.filter((t) => !selectedTodoIds.includes(t._id));
    setTodos(updated);
    saveTodos(updated);
    setSelectedTodoIds([]);
    showToast("Selected tasks deleted");
  };

  const handleExportTodos = () => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `privokeep-tasks-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950" />;
  }

  if (!user) {
    return <AuthView onSuccess={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {activeTab === "notes" ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Sidebar Filters & Stacks */}
            <NoteSidebar
              showArchived={showArchived}
              setShowArchived={setShowArchived}
              showFavorites={showFavorites}
              setShowFavorites={setShowFavorites}
              showImagesOnly={showImagesOnly}
              setShowImagesOnly={setShowImagesOnly}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPriority={selectedPriority}
              setSelectedPriority={setSelectedPriority}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              stacks={stacks}
              selectedStackId={selectedStackId}
              setSelectedStackId={setSelectedStackId}
              onCreateStack={handleCreateStack}
              onDeleteStack={handleDeleteStack}
              onTogglePinStack={handleTogglePinStack}
              noteCountsByStack={noteCountsByStack}
              onMoveNoteToStack={handleMoveNoteToStack}
            />

            {/* Notes Content Area */}
            <div className="flex-1">
              {/* Creator Form */}
              {!showArchived && (
                <NoteForm
                  onSubmit={handleCreateNote}
                  stacks={stacks}
                  activeStackId={selectedStackId}
                />
              )}

              {/* Quick Stack Drop Zone Bar */}
              {stacks.length > 0 && !showArchived && (
                <div className="mb-4 rounded-xl border border-dashed border-gray-200 bg-white/80 p-2.5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60 shadow-sm">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      <Layers className="h-3.5 w-3.5 text-blue-500" />
                      Move Notes Between Stacks (Drag & Drop or Click to Filter)
                    </span>
                    {selectedStackId && (
                      <button
                        onClick={() => setSelectedStackId(null)}
                        className="text-[11px] font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Show All Notes
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Unassign Drop Target */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const noteId =
                          e.dataTransfer.getData("application/privokeep-note") ||
                          e.dataTransfer.getData("text/plain");
                        if (noteId) handleMoveNoteToStack(noteId, null);
                      }}
                      onClick={() => setSelectedStackId(null)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                        !selectedStackId
                          ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                      title="Drop note here to remove from any stack"
                    >
                      <FileText className="h-3 w-3" />
                      <span>All / No Stack</span>
                    </div>

                    {/* Stack Targets */}
                    {stacks.map((stack) => {
                      const count = noteCountsByStack[stack._id] || 0;
                      const isSelected = selectedStackId === stack._id;
                      return (
                        <div
                          key={stack._id}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const noteId =
                              e.dataTransfer.getData("application/privokeep-note") ||
                              e.dataTransfer.getData("text/plain");
                            if (noteId) handleMoveNoteToStack(noteId, stack._id);
                          }}
                          onClick={() =>
                            setSelectedStackId(isSelected ? null : stack._id)
                          }
                          className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                              : "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-emerald-500"
                          }`}
                          title={`Drop note here to move to ${stack.name}`}
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: stack.color || "#3b82f6" }}
                          />
                          <span>{stack.name}</span>
                          <span className="rounded-full bg-black/5 px-1.5 text-[10px] text-gray-500 dark:bg-white/10 dark:text-gray-400">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Status Header */}
              <div className="mb-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">
                  {showArchived
                    ? "Archived Notes"
                    : showFavorites
                    ? "Favorite Notes"
                    : selectedStackId
                    ? `Stack: ${stacks.find((s) => s._id === selectedStackId)?.name}`
                    : "Active Notes"}
                </span>
                <span>{filteredNotes.length} notes</span>
              </div>

              {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
                  <div className="text-4xl">📭</div>
                  <h3 className="mt-3 text-base font-semibold text-gray-800 dark:text-gray-200">
                    {searchQuery
                      ? "No notes match your search"
                      : showArchived
                      ? "No archived notes"
                      : "No notes yet"}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "Try searching for a different keyword or tag."
                      : "Create your first note above to get started!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Pinned Section */}
                  {pinnedNotes.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                        <Pin className="h-3.5 w-3.5 fill-current" />
                        <span>Pinned Notes</span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {pinnedNotes.map((note) => (
                          <NoteCard
                            key={note._id}
                            note={note}
                            stacks={stacks}
                            onTogglePin={handleTogglePinNote}
                            onToggleArchive={handleToggleArchiveNote}
                            onToggleFavorite={handleToggleFavoriteNote}
                            onDelete={handleDeleteNote}
                            onEdit={setEditNote}
                            onShare={setShareNote}
                            onChangeColor={handleChangeNoteColor}
                            onMoveToStack={handleMoveNoteToStack}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Others Section */}
                  {otherNotes.length > 0 && (
                    <div>
                      {pinnedNotes.length > 0 && (
                        <div className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                          Others
                        </div>
                      )}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {otherNotes.map((note) => (
                          <NoteCard
                            key={note._id}
                            note={note}
                            stacks={stacks}
                            onTogglePin={handleTogglePinNote}
                            onToggleArchive={handleToggleArchiveNote}
                            onToggleFavorite={handleToggleFavoriteNote}
                            onDelete={handleDeleteNote}
                            onEdit={setEditNote}
                            onShare={setShareNote}
                            onChangeColor={handleChangeNoteColor}
                            onMoveToStack={handleMoveNoteToStack}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "todos" ? (
          /* Tasks (TodoApp) View */
          <div className="mx-auto max-w-4xl">
            {/* Stats Dashboard */}
            <TodoStats todos={todos} />

            {/* Add Task Form */}
            <TodoForm onAddTodo={handleAddTodo} />

            {/* Filter and Bulk Actions Bar */}
            <TodoFilters
              activeStatus={todoStatus}
              setActiveStatus={setTodoStatus}
              selectedCategory={todoCategory}
              setSelectedCategory={setTodoCategory}
              selectedPriority={todoPriority}
              setSelectedPriority={setTodoPriority}
              sortBy={todoSortBy}
              setSortBy={setTodoSortBy}
              categories={todoCategories}
              selectedCount={selectedTodoIds.length}
              totalVisible={filteredTodos.length}
              onSelectAll={handleSelectAllVisible}
              onBulkComplete={handleBulkComplete}
              onBulkDelete={handleBulkDelete}
              onExport={handleExportTodos}
            />

            {/* Task List */}
            <TodoList
              todos={filteredTodos}
              selectedTodoIds={selectedTodoIds}
              onToggleSelect={handleToggleSelectTodo}
              onToggleComplete={handleToggleCompleteTodo}
              onToggleSubtask={handleToggleSubtask}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>
        ) : (
          /* Neon Database Console View */
          <div className="mx-auto max-w-6xl">
            <NeonConsole notes={notes} todos={todos} />
          </div>
        )}
      </main>

      {/* Share Modal */}
      <ShareModal
        note={shareNote}
        isOpen={!!shareNote}
        onClose={() => setShareNote(null)}
      />

      {/* Edit Note Modal */}
      <EditNoteModal
        note={editNote}
        stacks={stacks}
        isOpen={!!editNote}
        onClose={() => setEditNote(null)}
        onSave={handleSaveEditedNote}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg animate-in fade-in slide-in-from-bottom-2 dark:bg-white dark:text-gray-900">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
