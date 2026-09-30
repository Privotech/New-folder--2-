export type NoteColor =
  | "default"
  | "yellow"
  | "blue"
  | "green"
  | "pink"
  | "purple";

export type NoteCategory = "personal" | "work" | "ideas" | "research" | "other";

export type NotePriority = "low" | "medium" | "high" | "urgent";

export interface NoteImage {
  url: string;
  caption?: string;
  publicId?: string;
  width?: number;
  height?: number;
}

export interface NoteReminder {
  isSet: boolean;
  dueDate?: string;
  frequency?: "once" | "daily" | "weekly";
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  color: NoteColor;
  category: NoteCategory;
  priority: NotePriority;
  tags: string[];
  images: NoteImage[];
  isPinned: boolean;
  isArchived: boolean;
  isFavorited: boolean;
  stackId?: string | null;
  reminder?: NoteReminder;
  createdAt: string;
  updatedAt: string;
}

export interface Stack {
  _id: string;
  userId: string;
  name: string;
  color: string;
  isPinned: boolean;
  isExpanded: boolean;
  createdAt: string;
}

export interface SubTask {
  title: string;
  completed: boolean;
}

export interface Todo {
  _id: string;
  userId: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  subtasks: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export interface TodoSummary {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
  dueToday: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  createdAt: string;
}
