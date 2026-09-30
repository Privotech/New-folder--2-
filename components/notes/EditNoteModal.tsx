"use client";

import React, { useState, useEffect } from "react";
import { Note, NoteColor, NoteCategory, NotePriority, Stack } from "@/types";
import { X, Save, Palette, Layers, Flag, Folder } from "lucide-react";

interface EditNoteModalProps {
  note: Note | null;
  stacks: Stack[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Note>) => void;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  note,
  stacks,
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<NoteColor>("default");
  const [category, setCategory] = useState<NoteCategory>("personal");
  const [priority, setPriority] = useState<NotePriority>("medium");
  const [stackId, setStackId] = useState<string | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || "");
      setColor(note.color || "default");
      setCategory(note.category || "personal");
      setPriority(note.priority || "medium");
      setStackId(note.stackId || null);
    }
  }, [note]);

  if (!isOpen || !note) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(note._id, {
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      color,
      category,
      priority,
      stackId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Edit Note</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm font-medium text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Color */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gray-500">Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value as NoteColor)}
                className="w-full rounded-md border border-gray-200 bg-transparent p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="default">Default</option>
                <option value="yellow">Yellow</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="pink">Pink</option>
                <option value="purple">Purple</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gray-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoteCategory)}
                className="w-full rounded-md border border-gray-200 bg-transparent p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="ideas">Ideas</option>
                <option value="research">Research</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gray-500">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NotePriority)}
                className="w-full rounded-md border border-gray-200 bg-transparent p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Stack */}
            <div>
              <label className="mb-1 block text-[11px] font-medium text-gray-500">Stack</label>
              <select
                value={stackId || ""}
                onChange={(e) => setStackId(e.target.value || null)}
                className="w-full rounded-md border border-gray-200 bg-transparent p-1.5 text-xs dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="">None</option>
                {stacks.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
