"use client";

import React, { useState } from "react";
import { NoteCategory, NoteColor, NotePriority, Stack } from "@/types";
import {
  FileText,
  Archive,
  Heart,
  Image as ImageIcon,
  Folder,
  Flag,
  Palette,
  Layers,
  ChevronDown,
  Plus,
  Pin,
  Trash2,
} from "lucide-react";

interface NoteSidebarProps {
  showArchived: boolean;
  setShowArchived: (val: boolean) => void;
  showFavorites: boolean;
  setShowFavorites: (val: boolean) => void;
  showImagesOnly: boolean;
  setShowImagesOnly: (val: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPriority: string;
  setSelectedPriority: (prio: string) => void;
  selectedColor: NoteColor | "all";
  setSelectedColor: (c: NoteColor | "all") => void;
  stacks: Stack[];
  selectedStackId: string | null;
  setSelectedStackId: (id: string | null) => void;
  onCreateStack: (name: string, color?: string) => void;
  onDeleteStack: (id: string) => void;
  onTogglePinStack: (id: string) => void;
  noteCountsByStack: Record<string, number>;
  onMoveNoteToStack?: (noteId: string, stackId: string | null) => void;
}

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  showArchived,
  setShowArchived,
  showFavorites,
  setShowFavorites,
  showImagesOnly,
  setShowImagesOnly,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  selectedColor,
  setSelectedColor,
  stacks,
  selectedStackId,
  setSelectedStackId,
  onCreateStack,
  onDeleteStack,
  onTogglePinStack,
  noteCountsByStack,
  onMoveNoteToStack,
}) => {
  const [collapsed, setCollapsed] = useState({
    views: false,
    category: false,
    priority: false,
    color: false,
    stacks: false,
  });

  const [dragOverStackId, setDragOverStackId] = useState<string | "none" | null>(null);

  const [newStackName, setNewStackName] = useState("");
  const [showAddStack, setShowAddStack] = useState(false);

  const handleCreateStackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStackName.trim()) {
      onCreateStack(newStackName.trim());
      setNewStackName("");
      setShowAddStack(false);
    }
  };

  return (
    <aside className="w-full shrink-0 space-y-6 lg:w-64">
      {/* Primary Views Section */}
      <div>
        <div
          onClick={() => setCollapsed({ ...collapsed, views: !collapsed.views })}
          className="flex cursor-pointer items-center justify-between px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase hover:text-gray-600 dark:hover:text-gray-300"
        >
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            <span>Notes</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${collapsed.views ? "-rotate-90" : ""}`}
          />
        </div>

        {!collapsed.views && (
          <div className="mt-2 space-y-1">
            <button
              onClick={() => {
                setShowArchived(false);
                setSelectedStackId(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                if (dragOverStackId !== "none") setDragOverStackId("none");
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverStackId(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                const noteId =
                  e.dataTransfer.getData("application/privokeep-note") ||
                  e.dataTransfer.getData("text/plain");
                if (noteId && onMoveNoteToStack) {
                  onMoveNoteToStack(noteId, null);
                }
                setDragOverStackId(null);
              }}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                dragOverStackId === "none"
                  ? "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900/80 scale-[1.02]"
                  : !showArchived && !showFavorites && !showImagesOnly && !selectedStackId
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" />
                <span>All Notes</span>
              </div>
              {dragOverStackId === "none" && (
                <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                  Drop to unassign
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setShowFavorites(!showFavorites);
                setShowArchived(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                showFavorites
                  ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Heart className={`h-4 w-4 ${showFavorites ? "fill-current" : ""}`} />
              Favorites
            </button>

            <button
              onClick={() => {
                setShowImagesOnly(!showImagesOnly);
                setShowArchived(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                showImagesOnly
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              With Images
            </button>

            <button
              onClick={() => {
                setShowArchived(!showArchived);
                setShowFavorites(false);
                setShowImagesOnly(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                showArchived
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Archive className="h-4 w-4" />
              Archive
            </button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div>
        <div
          onClick={() => setCollapsed({ ...collapsed, category: !collapsed.category })}
          className="flex cursor-pointer items-center justify-between px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase hover:text-gray-600 dark:hover:text-gray-300"
        >
          <div className="flex items-center gap-1.5">
            <Folder className="h-3.5 w-3.5" />
            <span>Category</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${collapsed.category ? "-rotate-90" : ""}`}
          />
        </div>

        {!collapsed.category && (
          <div className="mt-2 px-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
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

      {/* Priority */}
      <div>
        <div
          onClick={() => setCollapsed({ ...collapsed, priority: !collapsed.priority })}
          className="flex cursor-pointer items-center justify-between px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase hover:text-gray-600 dark:hover:text-gray-300"
        >
          <div className="flex items-center gap-1.5">
            <Flag className="h-3.5 w-3.5" />
            <span>Priority</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${collapsed.priority ? "-rotate-90" : ""}`}
          />
        </div>

        {!collapsed.priority && (
          <div className="mt-2 px-1">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
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

      {/* Color Filter Swatches */}
      <div>
        <div
          onClick={() => setCollapsed({ ...collapsed, color: !collapsed.color })}
          className="flex cursor-pointer items-center justify-between px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase hover:text-gray-600 dark:hover:text-gray-300"
        >
          <div className="flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            <span>Colors</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${collapsed.color ? "-rotate-90" : ""}`}
          />
        </div>

        {!collapsed.color && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5 px-2">
            <button
              onClick={() => setSelectedColor("all")}
              className={`rounded-md px-2 py-1 text-xs font-medium transition ${
                selectedColor === "all"
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              All
            </button>
            {(["yellow", "blue", "green", "pink", "purple"] as NoteColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(selectedColor === c ? "all" : c)}
                className={`h-6 w-6 rounded-full border border-black/10 transition hover:scale-110 ${
                  c === "yellow"
                    ? "bg-amber-300"
                    : c === "blue"
                    ? "bg-sky-300"
                    : c === "green"
                    ? "bg-emerald-300"
                    : c === "pink"
                    ? "bg-pink-300"
                    : "bg-purple-300"
                } ${selectedColor === c ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                title={`Filter ${c}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stacks Manager */}
      <div>
        <div
          onClick={() => setCollapsed({ ...collapsed, stacks: !collapsed.stacks })}
          className="flex cursor-pointer items-center justify-between px-2 text-xs font-semibold tracking-wider text-gray-400 uppercase hover:text-gray-600 dark:hover:text-gray-300"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>Stacks</span>
          </div>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${collapsed.stacks ? "-rotate-90" : ""}`}
          />
        </div>

        {!collapsed.stacks && (
          <div className="mt-2 space-y-1">
            {stacks.map((stack) => {
              const count = noteCountsByStack[stack._id] || 0;
              const isSelected = selectedStackId === stack._id;
              const isDragTarget = dragOverStackId === stack._id;

              return (
                <div
                  key={stack._id}
                  onClick={() => setSelectedStackId(isSelected ? null : stack._id)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverStackId !== stack._id) setDragOverStackId(stack._id);
                  }}
                  onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDragOverStackId(null);
                    }
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const noteId =
                      e.dataTransfer.getData("application/privokeep-note") ||
                      e.dataTransfer.getData("text/plain");
                    if (noteId && onMoveNoteToStack) {
                      onMoveNoteToStack(noteId, stack._id);
                    }
                    setDragOverStackId(null);
                  }}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isDragTarget
                      ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 scale-[1.03] shadow-md"
                      : isSelected
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: stack.color || "#3b82f6" }}
                    />
                    <span className="truncate">{stack.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDragTarget ? (
                      <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                        Drop to move
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {count}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePinStack(stack._id);
                      }}
                      className={`p-1 opacity-0 transition group-hover:opacity-100 ${
                        stack.isPinned ? "text-amber-500 opacity-100" : "text-gray-400 hover:text-amber-500"
                      }`}
                      title={stack.isPinned ? "Unpin stack" : "Pin stack"}
                    >
                      <Pin className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteStack(stack._id);
                      }}
                      className="p-1 text-gray-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                      title="Delete stack"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {showAddStack ? (
              <form onSubmit={handleCreateStackSubmit} className="mt-2 flex gap-1 px-1">
                <input
                  type="text"
                  value={newStackName}
                  onChange={(e) => setNewStackName(e.target.value)}
                  placeholder="Stack name..."
                  autoFocus
                  className="w-full rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStack(false)}
                  className="rounded-md px-1.5 py-1 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowAddStack(true)}
                className="flex w-full items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
              >
                <Plus className="h-3.5 w-3.5" />
                Create New Stack
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
