import { useState, useEffect } from "react";
import "./PrivoKeep.css";
import NoteForm from "./components/NoteForm";
import NoteGrid from "./components/NoteGrid";
import SearchBar from "./components/SearchBar";
import AuthPanel from "./components/AuthPanel";
import AdvancedFilters from "./components/AdvancedFilters";
import ShareModal from "./components/ShareModal";
import StackManager from "./components/StackManager";
import {
  SunIcon,
  MoonIcon,
  ArchiveIcon,
  PinIcon,
  DeleteIcon,
  SearchIcon,
  NoteIcon,
  HeartIcon,
  DownloadIcon,
  FolderIcon,
  FlagIcon,
  PaletteIcon,
  ChevronDownIcon,
  ImageIcon,
} from "./components/Icons";

export default function PrivoKeep() {
  const [notes, setNotes] = useState([]);
  const [stacks, setStacks] = useState([]);
  const [selectedStack, setSelectedStack] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showOnlyImages, setShowOnlyImages] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNoteForShare, setSelectedNoteForShare] = useState(null);
  const [filters, setFilters] = useState({});
  const [collapsedSections, setCollapsedSections] = useState({
    notes: false,
    category: false,
    priority: false,
    colors: false,
  });

  const API_URL = "http://localhost:5001/api/notes";
  const STACKS_API_URL = "http://localhost:5001/api/stacks";

  // Load initial settings
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (token) {
      loadCurrentUser();
    } else {
      setAuthLoading(false);
    }
  }, []);

  // Fetch notes when user is authenticated
  useEffect(() => {
    if (token && authUser) {
      fetchNotes();
      fetchStacks();
    }
  }, [token, authUser]);

  // Update document theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty("--bg-primary", "#1a1a1a");
      document.documentElement.style.setProperty("--bg-secondary", "#2d2d2d");
      document.documentElement.style.setProperty("--text-primary", "#ffffff");
    } else {
      document.documentElement.style.setProperty("--bg-primary", "#ffffff");
      document.documentElement.style.setProperty("--bg-secondary", "#f5f5f5");
      document.documentElement.style.setProperty("--text-primary", "#202124");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Filter notes based on search and settings - ENHANCED
  useEffect(() => {
    let filtered = notes.filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags &&
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ));

      const matchesArchive =
        showArchived === true ? note.isArchived : !note.isArchived;

      const matchesColor =
        selectedColor === "all" ? true : note.color === selectedColor;

      const matchesCategory =
        selectedCategory === "all"
          ? true
          : note.category === selectedCategory;

      const matchesPriority =
        selectedPriority === "all"
          ? true
          : note.priority === selectedPriority;

      const matchesFavorite = showOnlyFavorites
        ? note.isFavorited === true
        : true;

      const matchesImages = showOnlyImages
        ? note.images && note.images.length > 0
        : true;

      // Apply advanced filters
      let matchesAdvancedFilters = true;
      if (Object.keys(filters).length > 0) {
        if (
          filters.category &&
          filters.category !== "all" &&
          note.category !== filters.category
        ) {
          matchesAdvancedFilters = false;
        }
        if (
          filters.priority &&
          filters.priority !== "all" &&
          note.priority !== filters.priority
        ) {
          matchesAdvancedFilters = false;
        }
        if (filters.onlyFavorited && !note.isFavorited) {
          matchesAdvancedFilters = false;
        }
        if (filters.hasImages && (!note.images || note.images.length === 0)) {
          matchesAdvancedFilters = false;
        }
      }

      return (
        matchesSearch &&
        matchesArchive &&
        matchesColor &&
        matchesCategory &&
        matchesPriority &&
        matchesFavorite &&
        matchesImages &&
        matchesAdvancedFilters
      );
    });

    // Sort: pinned notes first, then by creation date
    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return b.isPinned ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredNotes(filtered);
  }, [
    notes,
    searchQuery,
    showArchived,
    selectedColor,
    selectedCategory,
    selectedPriority,
    showOnlyFavorites,
    showOnlyImages,
    filters,
  ]);

  const loadCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      if (user) {
        setAuthUser(user);
      } else {
        setToken("");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error loading user:", error);
      setToken("");
      localStorage.removeItem("token");
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchNotes = () => {
    setLoading(true);
    try {
      const userId = authUser?.id;
      if (!userId) return;

      const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      const userNotes = allNotes.filter((note) => note.userId === userId);
      setNotes(userNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      showToast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStacks = () => {
    try {
      const userId = authUser?.id;
      if (!userId) return;

      const allStacks = JSON.parse(localStorage.getItem("stacks") || "[]");
      const userStacks = allStacks.filter((stack) => stack.userId === userId);
      setStacks(userStacks);
    } catch (error) {
      console.error("Error fetching stacks:", error);
    }
  };

  const createNote = (noteData, contentArg, colorArg) => {
    // Support both signature styles: createNote(noteObj) and createNote(title, content, color)
    const isStringSignature = typeof noteData === "string";
    const noteContent = isStringSignature ? contentArg : noteData?.content;
    const noteColor = isStringSignature ? colorArg : noteData?.color || "yellow";
    const title = isStringSignature ? noteData : noteData?.title || "Untitled Note";

    if (!title?.trim() && !noteContent?.trim()) {
      showToast("Note cannot be empty", "error");
      return;
    }

    try {
      const newNote = {
        _id: Date.now().toString(),
        userId: authUser?.id,
        title: title,
        content: noteContent || "",
        color: noteColor,
        category: noteData?.category || "personal",
        priority: noteData?.priority || "medium",
        tags: noteData?.tags || [],
        images: noteData?.images || [],
        isPinned: false,
        isArchived: false,
        isFavorited: false,
        reminder: noteData?.dueDate
          ? {
              isSet: true,
              dueDate: noteData.dueDate,
              frequency: "once",
            }
          : { isSet: false },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      allNotes.push(newNote);
      localStorage.setItem("notes", JSON.stringify(allNotes));
      setNotes(allNotes.filter((note) => note.userId === authUser?.id));
      showToast("Note created successfully", "success");
    } catch (error) {
      console.error("Error creating note:", error);
      showToast("Failed to create note", "error");
    }
  };

  const updateNote = (id, title, content, color) => {
    try {
      const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      const updated = allNotes.map((note) =>
        (note._id === id || note.id === id)
          ? {
              ...note,
              title: title || "Untitled Note",
              content,
              color,
              updatedAt: new Date().toISOString(),
            }
          : note,
      );
      localStorage.setItem("notes", JSON.stringify(updated));

      setNotes(
        notes.map((note) =>
          (note._id === id || note.id === id)
            ? {
                ...note,
                title: title || "Untitled Note",
                content,
                color,
                updatedAt: new Date().toISOString(),
              }
            : note,
        ),
      );
      setEditingId(null);
      setEditFormData(null);
      showToast("Note updated successfully", "success");
    } catch (error) {
      console.error("Error updating note:", error);
      showToast("Error updating note", "error");
    }
  };

  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
        const filtered = allNotes.filter((note) => !(note._id === id || note.id === id));
        localStorage.setItem("notes", JSON.stringify(filtered));

        setNotes(notes.filter((note) => !(note._id === id || note.id === id)));
        showToast("Note deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting note:", error);
        showToast("Error deleting note", "error");
      }
    }
  };

  const togglePin = (id) => {
    try {
      const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      const updated = allNotes.map((note) =>
        (note._id === id || note.id === id) ? { ...note, isPinned: !note.isPinned } : note,
      );
      localStorage.setItem("notes", JSON.stringify(updated));

      setNotes(
        notes.map((note) =>
          (note._id === id || note.id === id) ? { ...note, isPinned: !note.isPinned } : note,
        ),
      );
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const toggleArchive = (id) => {
    try {
      const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      const updated = allNotes.map((note) =>
        (note._id === id || note.id === id) ? { ...note, isArchived: !note.isArchived } : note,
      );
      localStorage.setItem("notes", JSON.stringify(updated));

      setNotes(
        notes.map((note) =>
          (note._id === id || note.id === id) ? { ...note, isArchived: !note.isArchived } : note,
        ),
      );
    } catch (error) {
      console.error("Error archiving note:", error);
    }
  };

  const showToast = (message, type) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const handleLogout = () => {
    setToken("");
    setAuthUser(null);
    localStorage.removeItem("token");
  };

  // Enhanced handlers for new features
  const handleToggleFavorite = (noteId) => {
    const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = allNotes.map((note) =>
      note._id === noteId ? { ...note, isFavorited: !note.isFavorited } : note
    );
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes.filter((note) => note.userId === authUser?.id));
    showToast("Favorite updated", "success");
  };

  const handleShare = ({ noteId, email, role }) => {
    const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = allNotes.map((note) => {
      if (note._id === noteId) {
        return {
          ...note,
          isShared: true,
          collaborators: [
            ...(note.collaborators || []),
            { email, role, addedAt: new Date().toISOString() },
          ],
        };
      }
      return note;
    });
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes.filter((note) => note.userId === authUser?.id));
    setShowShareModal(false);
    showToast(`Note shared with ${email}`, "success");
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Stack handlers
  const handleCreateStack = (stackData) => {
    const newStack = {
      _id: Date.now().toString(),
      userId: authUser?.id,
      name: stackData.name,
      description: stackData.description || "",
      color: stackData.color || "blue",
      icon: stackData.icon || "📚",
      notes: [],
      isExpanded: true,
      isPinned: false,
      order: stacks.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const allStacks = JSON.parse(localStorage.getItem("stacks") || "[]");
    allStacks.push(newStack);
    localStorage.setItem("stacks", JSON.stringify(allStacks));
    setStacks([...stacks, newStack]);
    showToast(`Stack "${newStack.name}" created`, "success");
  };

  const handleDeleteStack = (stackId) => {
    const stackToDelete = stacks.find((s) => s._id === stackId);
    if (!stackToDelete) return;

    // Remove stackId from all notes in this stack
    const updatedNotes = notes.map((note) =>
      note.stackId === stackId ? { ...note, stackId: null } : note
    );
    setNotes(updatedNotes);

    const allNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedAllNotes = allNotes.map((note) =>
      note.stackId === stackId ? { ...note, stackId: null } : note
    );
    localStorage.setItem("notes", JSON.stringify(updatedAllNotes));

    // Delete stack
    const updatedStacks = stacks.filter((s) => s._id !== stackId);
    const allStacks = JSON.parse(localStorage.getItem("stacks") || "[]");
    const filteredStacks = allStacks.filter((s) => s._id !== stackId);
    localStorage.setItem("stacks", JSON.stringify(filteredStacks));
    setStacks(updatedStacks);
    showToast(`Stack "${stackToDelete.name}" deleted`, "success");
  };

  const handleToggleStackExpanded = (stackId) => {
    const updatedStacks = stacks.map((stack) =>
      stack._id === stackId
        ? { ...stack, isExpanded: !stack.isExpanded }
        : stack
    );
    setStacks(updatedStacks);

    const allStacks = JSON.parse(localStorage.getItem("stacks") || "[]");
    const updated = allStacks.map((stack) =>
      stack._id === stackId
        ? { ...stack, isExpanded: !stack.isExpanded }
        : stack
    );
    localStorage.setItem("stacks", JSON.stringify(updated));
  };

  const handlePinStack = (stackId) => {
    const updatedStacks = stacks.map((stack) =>
      stack._id === stackId ? { ...stack, isPinned: !stack.isPinned } : stack
    );
    setStacks(updatedStacks);

    const allStacks = JSON.parse(localStorage.getItem("stacks") || "[]");
    const updated = allStacks.map((stack) =>
      stack._id === stackId ? { ...stack, isPinned: !stack.isPinned } : stack
    );
    localStorage.setItem("stacks", JSON.stringify(updated));
  };

  if (authLoading) {
    return <div className="loading">Loading PrivoKeep...</div>;
  }

  const handleAuthSuccess = ({ token, user }) => {
    setToken(token);
    setAuthUser(user);
    setAuthLoading(false);
  };

  if (!authUser) {
    return <AuthPanel onAuthSuccess={handleAuthSuccess} />;
  }
  return (
    <div className={`privokeep-container ${darkMode ? "dark" : "light"}`}>
      <header className="privokeep-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">
              <NoteIcon />
            </span>
            <h1>PrivoKeep</h1>
          </div>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="user-menu">
            <span className="user-name">
              {authUser.name || authUser.email}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="privokeep-main">
        {/* Sidebar Filters */}
        <aside className="privokeep-sidebar">
          <div className="filter-section">
            <div
              className="filter-section-header"
              onClick={() => setCollapsedSections({ ...collapsedSections, notes: !collapsedSections.notes })}
            >
              <NoteIcon />
              <h3>Notes</h3>
              <ChevronDownIcon className={`chevron ${collapsedSections.notes ? "collapsed" : ""}`} />
            </div>
            {!collapsedSections.notes && (
              <div className="filter-section-content">
                <button
                  className={`filter-btn ${!showArchived ? "active" : ""}`}
                  onClick={() => setShowArchived(false)}
                >
                  <NoteIcon /> All Notes
                </button>
                <button
                  className={`filter-btn ${showArchived ? "active" : ""}`}
                  onClick={() => setShowArchived(true)}
                >
                  <ArchiveIcon /> Archive
                </button>

                <button
                  className={`filter-btn ${showOnlyFavorites ? "active" : ""}`}
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                >
                  <HeartIcon /> Favorites
                </button>

                <button
                  className={`filter-btn ${showOnlyImages ? "active" : ""}`}
                  onClick={() => setShowOnlyImages(!showOnlyImages)}
                >
                  <ImageIcon /> With Images
                </button>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-section-header"
              onClick={() => setCollapsedSections({ ...collapsedSections, category: !collapsedSections.category })}
            >
              <FolderIcon />
              <h3>Category</h3>
              <ChevronDownIcon className={`chevron ${collapsedSections.category ? "collapsed" : ""}`} />
            </div>
            {!collapsedSections.category && (
              <div className="filter-section-content">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="all">All Categories</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="ideas">Ideas</option>
                  <option value="research">Research</option>
                </select>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-section-header"
              onClick={() => setCollapsedSections({ ...collapsedSections, priority: !collapsedSections.priority })}
            >
              <FlagIcon />
              <h3>Priority</h3>
              <ChevronDownIcon className={`chevron ${collapsedSections.priority ? "collapsed" : ""}`} />
            </div>
            {!collapsedSections.priority && (
              <div className="filter-section-content">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="priority-select"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            )}
          </div>

          <div className="filter-section">
            <div
              className="filter-section-header"
              onClick={() => setCollapsedSections({ ...collapsedSections, colors: !collapsedSections.colors })}
            >
              <PaletteIcon />
              <h3>Colors</h3>
              <ChevronDownIcon className={`chevron ${collapsedSections.colors ? "collapsed" : ""}`} />
            </div>
            {!collapsedSections.colors && (
              <div className="filter-section-content">
                <div className="color-filters">
                  <button
                    className={`color-filter ${selectedColor === "all" ? "active" : ""}`}
                    onClick={() => setSelectedColor("all")}
                    title="All colors"
                  >
                    All
                  </button>
                  {["yellow", "blue", "green", "pink", "purple"].map((color) => (
                    <button
                      key={color}
                      className={`color-filter color-${color} ${selectedColor === color ? "active" : ""
                        }`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stacks Manager */}
          <StackManager
            stacks={stacks}
            selectedStack={selectedStack}
            onSelectStack={setSelectedStack}
            onCreateStack={handleCreateStack}
            onDeleteStack={handleDeleteStack}
            onToggleExpanded={handleToggleStackExpanded}
            onPinStack={handlePinStack}
          />
        </aside>

        {/* Main Content */}
        <main className="privokeep-content">
          <div className="content-toolbar">
            <NoteForm onSubmit={createNote} loading={loading} stacks={stacks} />
            <AdvancedFilters
              onFilterChange={handleFilterChange}
              categories={["personal", "work", "ideas", "research"]}
              priorities={["low", "medium", "high", "urgent"]}
            />
          </div>

          {loading && filteredNotes.length === 0 ? (
            <div className="loading">Loading your notes...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>
                {searchQuery
                  ? "No notes found matching your search"
                  : showArchived
                    ? "No archived notes yet"
                    : "No notes yet. Create your first note!"}
              </p>
            </div>
          ) : (
            <>
              <NoteGrid
                notes={filteredNotes}
                onEdit={(note) => {
                  setEditingId(note._id);
                  setEditFormData(note);
                }}
                onDelete={deleteNote}
                onTogglePin={togglePin}
                onToggleArchive={toggleArchive}
                onToggleFavorite={handleToggleFavorite}
                onShare={(noteId) => {
                  setSelectedNoteForShare(noteId);
                  setShowShareModal(true);
                }}
                editingId={editingId}
                editFormData={editFormData}
                onSaveEdit={updateNote}
                onCancelEdit={() => {
                  setEditingId(null);
                  setEditFormData(null);
                }}
              />
              <ShareModal
                noteId={selectedNoteForShare}
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                onShare={handleShare}
              />
            </>
          )}
        </main>
      </div>

      {/* Toast Notification */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

