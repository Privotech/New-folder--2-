import { Note, Stack, Todo, User } from "@/types";

const SEED_USER: User = {
  id: "user-1",
  username: "privilege",
  name: "Oyegbile Privilege",
  email: "privilege@privokeep.app",
  createdAt: new Date().toISOString(),
};

const SEED_STACKS: Stack[] = [
  {
    _id: "stack-1",
    userId: "user-1",
    name: "Engineering & Architecture",
    color: "#3b82f6",
    isPinned: true,
    isExpanded: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "stack-2",
    userId: "user-1",
    name: "Product Design & Ideas",
    color: "#10b981",
    isPinned: false,
    isExpanded: true,
    createdAt: new Date().toISOString(),
  },
];

const SEED_NOTES: Note[] = [
  {
    _id: "note-1",
    userId: "user-1",
    title: "Welcome to PrivoKeep Suite 🚀",
    content:
      "PrivoKeep is your personal productivity workspace combining Google Keep-style cards with a powerful Task Management board.\n\n✨ Features:\n• Color-coded notes with rich tagging\n• Priority flags and category organization\n• Stacks hierarchy for grouping related notes\n• Full dark and light theme support\n• Instant image uploads & offline backup",
    color: "yellow",
    category: "ideas",
    priority: "high",
    tags: ["welcome", "guide", "productivity"],
    images: [],
    isPinned: true,
    isArchived: false,
    isFavorited: true,
    stackId: "stack-1",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "note-2",
    userId: "user-1",
    title: "Next.js & Tailwind Architecture",
    content:
      "Full migration to Next.js 15, App Router, TypeScript, and Tailwind CSS. The app features server/client hybrid rendering, zero external server bottlenecks, and snappy state synchronization.",
    color: "blue",
    category: "work",
    priority: "medium",
    tags: ["nextjs", "typescript", "tailwindcss"],
    images: [],
    isPinned: true,
    isArchived: false,
    isFavorited: true,
    stackId: "stack-1",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "note-3",
    userId: "user-1",
    title: "Design System & Color Tokens",
    content:
      "Color palettes mapped to subtle pastel highlights with clean borders:\n- Yellow: #fef9c3\n- Blue: #e0f2fe\n- Green: #dcfce7\n- Pink: #fce7f3\n- Purple: #f3e8ff",
    color: "pink",
    category: "research",
    priority: "low",
    tags: ["design", "colors", "tokens"],
    images: [],
    isPinned: false,
    isArchived: false,
    isFavorited: false,
    stackId: "stack-2",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const SEED_TODOS: Todo[] = [
  {
    _id: "todo-1",
    userId: "user-1",
    title: "Review Next.js project migration",
    description: "Verify TypeScript compilation, Tailwind CSS styling, and responsive layout.",
    priority: "high",
    category: "Engineering",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    completed: true,
    completedAt: new Date().toISOString(),
    subtasks: [
      { title: "Configure next.config.mjs and tsconfig.json", completed: true },
      { title: "Port Notes and Stacks components", completed: true },
      { title: "Port Todo and Filter components", completed: true },
    ],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "todo-2",
    userId: "user-1",
    title: "Organize quarterly goals into Stacks",
    description: "Group high-priority notes into dedicated engineering and product stacks.",
    priority: "medium",
    category: "Planning",
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0],
    completed: false,
    subtasks: [
      { title: "Create Roadmap stack", completed: false },
      { title: "Tag action items", completed: false },
    ],
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "todo-3",
    userId: "user-1",
    title: "Test dark mode & mobile navigation",
    description: "Verify contrast ratios, toggle responsiveness, and quick action bars on mobile screens.",
    priority: "low",
    category: "Quality",
    dueDate: new Date().toISOString().split("T")[0],
    completed: false,
    subtasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to check localStorage availability in SSR
const isClient = typeof window !== "undefined";

export const getStoredUser = (): User | null => {
  if (!isClient) return null;
  const user = localStorage.getItem("currentUser");
  if (!user) {
    // Auto-login seed user for seamless first load
    localStorage.setItem("currentUser", JSON.stringify(SEED_USER));
    return SEED_USER;
  }
  try {
    return JSON.parse(user);
  } catch {
    return SEED_USER;
  }
};

export const setStoredUser = (user: User | null): void => {
  if (!isClient) return;
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
  }
};

export const getStoredNotes = (userId?: string): Note[] => {
  if (!isClient) return SEED_NOTES;
  const raw = localStorage.getItem("notes");
  if (!raw) {
    localStorage.setItem("notes", JSON.stringify(SEED_NOTES));
    return userId ? SEED_NOTES.filter((n) => n.userId === userId) : SEED_NOTES;
  }
  try {
    const all = JSON.parse(raw);
    return userId ? all.filter((n: Note) => n.userId === userId) : all;
  } catch {
    return SEED_NOTES;
  }
};

export const saveNotes = (notes: Note[]): void => {
  if (!isClient) return;
  localStorage.setItem("notes", JSON.stringify(notes));
};

export const getStoredStacks = (userId?: string): Stack[] => {
  if (!isClient) return SEED_STACKS;
  const raw = localStorage.getItem("stacks");
  if (!raw) {
    localStorage.setItem("stacks", JSON.stringify(SEED_STACKS));
    return userId ? SEED_STACKS.filter((s) => s.userId === userId) : SEED_STACKS;
  }
  try {
    const all = JSON.parse(raw);
    return userId ? all.filter((s: Stack) => s.userId === userId) : all;
  } catch {
    return SEED_STACKS;
  }
};

export const saveStacks = (stacks: Stack[]): void => {
  if (!isClient) return;
  localStorage.setItem("stacks", JSON.stringify(stacks));
};

export const getStoredTodos = (userId?: string): Todo[] => {
  if (!isClient) return SEED_TODOS;
  const raw = localStorage.getItem("todos");
  if (!raw) {
    localStorage.setItem("todos", JSON.stringify(SEED_TODOS));
    return userId ? SEED_TODOS.filter((t) => t.userId === userId) : SEED_TODOS;
  }
  try {
    const all = JSON.parse(raw);
    return userId ? all.filter((t: Todo) => t.userId === userId) : all;
  } catch {
    return SEED_TODOS;
  }
};

export const saveTodos = (todos: Todo[]): void => {
  if (!isClient) return;
  localStorage.setItem("todos", JSON.stringify(todos));
};
