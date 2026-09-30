"use client";

import React, { useState } from "react";
import { Note, NoteColor, Stack } from "@/types";
import {
  Pin,
  Heart,
  Archive,
  ArchiveRestore,
  Share2,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  Palette,
  GripVertical,
} from "lucide-react";

interface NoteCardProps {
  note: Note;
  stacks: Stack[];
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
  onShare: (note: Note) => void;
  onChangeColor: (id: string, color: NoteColor) => void;
  onMoveToStack?: (noteId: string, stackId: string | null) => void;
}

const COLOR_MAP: Record<NoteColor, { card: string; border: string }> = {
  default: {
    card: "bg-white dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
  },
  yellow: {
    card: "bg-amber-50 dark:bg-amber-950/40",
    border: "border-amber-200 dark:border-amber-800/60",
  },
  blue: {
    card: "bg-sky-50 dark:bg-sky-950/40",
    border: "border-sky-200 dark:border-sky-800/60",
  },
  green: {
    card: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200 dark:border-emerald-800/60",
  },
  pink: {
    card: "bg-pink-50 dark:bg-pink-950/40",
    border: "border-pink-200 dark:border-pink-800/60",
  },
  purple: {
    card: "bg-purple-50 dark:bg-purple-950/40",
    border: "border-purple-200 dark:border-purple-800/60",
  },
};

const PRIORITY_BADGES = {
  low: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300",
};

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  stacks,
  onTogglePin,
  onToggleArchive,
  onToggleFavorite,
  onDelete,
  onEdit,
  onShare,
  onChangeColor,
  onMoveToStack,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStackPicker, setShowStackPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const stack = stacks.find((s) => s._id === note.stackId);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/privokeep-note", note._id);
    e.dataTransfer.setData("text/plain", note._id);
    e.dataTransfer.effectAllowed = "move";
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group relative flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md ${
        isDragging
          ? "opacity-40 scale-[0.98] ring-2 ring-blue-500 shadow-xl"
          : ""
      } ${COLOR_MAP[note.color || "default"].card} ${
        COLOR_MAP[note.color || "default"].border
      }`}
    >
      <div>
        {/* Top Header: Title & Pin/Favorite */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span
              className="text-gray-400 opacity-60 hover:opacity-100 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0"
              title="Drag to move note into another stack"
            >
              <GripVertical className="h-4 w-4" />
            </span>
            <h3 className="text-base font-semibold text-gray-900 break-words dark:text-white truncate">
              {note.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleFavorite(note._id)}
              className={`rounded-full p-1 transition ${
                note.isFavorited
                  ? "text-red-500"
                  : "text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
              }`}
              title={note.isFavorited ? "Remove favorite" : "Add to favorites"}
            >
              <Heart className={`h-4 w-4 ${note.isFavorited ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => onTogglePin(note._id)}
              className={`rounded-full p-1 transition ${
                note.isPinned
                  ? "text-amber-500"
                  : "text-gray-400 opacity-0 group-hover:opacity-100 hover:text-amber-500"
              }`}
              title={note.isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin className={`h-4 w-4 ${note.isPinned ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Note Content */}
        {note.content && (
          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap break-words dark:text-gray-300">
            {note.content}
          </p>
        )}

        {/* Images */}
        {note.images && note.images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-1.5 overflow-hidden rounded-lg">
            {note.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={img.caption || "Note attachment"}
                className="h-28 w-full object-cover transition hover:scale-105"
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-white/10 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/10">
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          {/* Priority */}
          <span
            className={`rounded-md px-1.5 py-0.5 font-medium capitalize ${
              PRIORITY_BADGES[note.priority || "medium"]
            }`}
          >
            {note.priority || "medium"}
          </span>

          {/* Category */}
          <span className="rounded-md bg-gray-100 px-1.5 py-0.5 font-medium text-gray-600 capitalize dark:bg-gray-800 dark:text-gray-400">
            {note.category || "personal"}
          </span>

          {/* Stack Selector / Drop Indicator */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStackPicker(!showStackPicker);
              }}
              className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium transition ${
                stack
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
              title="Click or drag note to change stack"
            >
              <Layers className="h-3 w-3" />
              <span>{stack ? stack.name : "No Stack"}</span>
            </button>

            {showStackPicker && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full left-0 mb-1 z-30 min-w-[150px] rounded-lg border border-gray-200 bg-white p-1 text-xs shadow-lg dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="px-2 py-1 font-semibold text-gray-400 text-[10px] uppercase">
                  Move to Stack
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onMoveToStack?.(note._id, null);
                    setShowStackPicker(false);
                  }}
                  className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    !note.stackId ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span>None (Unassigned)</span>
                </button>
                {stacks.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => {
                      onMoveToStack?.(note._id, s._id);
                      setShowStackPicker(false);
                    }}
                    className={`flex w-full items-center gap-1.5 rounded px-2 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      note.stackId === s._id ? "font-bold text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: s.color || "#3b82f6" }}
                    />
                    <span className="truncate">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reminder */}
          {note.reminder?.isSet && note.reminder.dueDate && (
            <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              {note.reminder.dueDate}
            </span>
          )}
        </div>

        {/* Action Toolbar (visible on hover or focus) */}
        <div className="flex items-center justify-between text-gray-500 opacity-90 transition group-hover:opacity-100 dark:text-gray-400">
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="rounded-md p-1.5 hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
              title="Change color"
            >
              <Palette className="h-3.5 w-3.5" />
            </button>
            {showColorPicker && (
              <div className="absolute bottom-full left-0 mb-1 z-20 flex gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-md dark:border-gray-700 dark:bg-gray-800">
                {(["default", "yellow", "blue", "green", "pink", "purple"] as NoteColor[]).map(
                  (c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onChangeColor(note._id, c);
                        setShowColorPicker(false);
                      }}
                      className={`h-4 w-4 rounded-full border border-black/10 ${
                        c === "default"
                          ? "bg-white dark:bg-gray-700"
                          : c === "yellow"
                          ? "bg-amber-300"
                          : c === "blue"
                          ? "bg-blue-300"
                          : c === "green"
                          ? "bg-emerald-300"
                          : c === "pink"
                          ? "bg-pink-300"
                          : "bg-purple-300"
                      }`}
                    />
                  ),
                )}
              </div>
            )}

            <button
              onClick={() => onShare(note)}
              className="rounded-md p-1.5 hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
              title="Share Note"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() => onToggleArchive(note._id)}
              className="rounded-md p-1.5 hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
              title={note.isArchived ? "Unarchive Note" : "Archive Note"}
            >
              {note.isArchived ? (
                <ArchiveRestore className="h-3.5 w-3.5" />
              ) : (
                <Archive className="h-3.5 w-3.5" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(note)}
              className="rounded-md p-1.5 hover:bg-black/5 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white"
              title="Edit Note"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onDelete(note._id)}
              className="rounded-md p-1.5 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              title="Delete Note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
