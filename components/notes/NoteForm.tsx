"use client";

import React, { useState, useRef } from "react";
import { Note, NoteColor, NoteCategory, NotePriority, Stack, NoteImage } from "@/types";
import {
  Palette,
  Image as ImageIcon,
  Tag,
  Pin,
  Calendar,
  Layers,
  Flag,
  Folder,
  X,
  Plus,
} from "lucide-react";

interface NoteFormProps {
  onSubmit: (noteData: Partial<Note>) => void;
  stacks: Stack[];
  activeStackId?: string | null;
}

const COLOR_CLASSES: Record<NoteColor, { bg: string; border: string }> = {
  default: {
    bg: "bg-white dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
  },
  yellow: {
    bg: "bg-amber-50/80 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/50",
  },
  blue: {
    bg: "bg-blue-50/80 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800/50",
  },
  green: {
    bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800/50",
  },
  pink: {
    bg: "bg-pink-50/80 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-800/50",
  },
  purple: {
    bg: "bg-purple-50/80 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800/50",
  },
};

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, stacks, activeStackId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState<NoteColor>("default");
  const [category, setCategory] = useState<NoteCategory>("personal");
  const [priority, setPriority] = useState<NotePriority>("medium");
  const [isPinned, setIsPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<NoteImage[]>([]);
  const [stackId, setStackId] = useState<string | null>(activeStackId || null);
  const [dueDate, setDueDate] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setColor("default");
    setCategory("personal");
    setPriority("medium");
    setIsPinned(false);
    setTags([]);
    setTagInput("");
    setImages([]);
    setDueDate("");
    setShowColorPicker(false);
    setIsExpanded(false);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() && !content.trim() && images.length === 0) {
      setIsExpanded(false);
      return;
    }

    onSubmit({
      title: title.trim() || "Untitled Note",
      content: content.trim(),
      color,
      category,
      priority,
      isPinned,
      tags,
      images,
      stackId,
      reminder: dueDate ? { isSet: true, dueDate, frequency: "once" } : { isSet: false },
    });

    resetForm();
  };

  const handleAddTag = () => {
    const val = tagInput.trim().replace(/^#/, "");
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [
          ...prev,
          {
            url: reader.result as string,
            caption: file.name,
            publicId: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div
      ref={containerRef}
      className={`mx-auto mb-8 w-full max-w-2xl rounded-xl border shadow-sm transition-all duration-200 ${
        COLOR_CLASSES[color].bg
      } ${COLOR_CLASSES[color].border} ${
        isExpanded ? "shadow-md ring-1 ring-black/5 dark:ring-white/10" : ""
      }`}
    >
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="flex cursor-text items-center justify-between p-3.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <span>Take a note...</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                fileInputRef.current?.click();
              }}
              className="p-1 hover:text-blue-500"
              title="Add Image"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
                setIsPinned(true);
              }}
              className="p-1 hover:text-amber-500"
              title="Pin Note"
            >
              <Pin className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          {/* Title & Pin */}
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-transparent text-base font-semibold text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white"
            />
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`rounded-full p-1.5 transition ${
                isPinned
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                  : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              title={isPinned ? "Unpin note" : "Pin note"}
            >
              <Pin className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Take a note..."
            rows={3}
            className="mt-2 w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-gray-200"
          />

          {/* Attached Images */}
          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((img, idx) => (
                <div key={idx} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <img src={img.url} alt="Uploaded" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tag Badges */}
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-gray-700 dark:bg-white/10 dark:text-gray-300"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== idx))}
                    className="hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Metadata Controls */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/60 pt-3 dark:border-gray-700/60">
            <div className="flex flex-wrap items-center gap-1.5 text-gray-600 dark:text-gray-400">
              {/* Color Swatch Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
                  title="Color palette"
                >
                  <Palette className="h-4 w-4" />
                </button>
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 mb-2 flex gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {(["default", "yellow", "blue", "green", "pink", "purple"] as NoteColor[]).map(
                      (c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setColor(c);
                            setShowColorPicker(false);
                          }}
                          className={`h-5 w-5 rounded-full border border-black/10 transition hover:scale-110 ${
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
                          } ${color === c ? "ring-2 ring-blue-500" : ""}`}
                        />
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Image Input */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10"
                title="Add image"
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Category selector */}
              <div className="flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-xs dark:bg-white/5">
                <Folder className="h-3 w-3" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NoteCategory)}
                  className="bg-transparent focus:outline-none"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="ideas">Ideas</option>
                  <option value="research">Research</option>
                </select>
              </div>

              {/* Priority selector */}
              <div className="flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-xs dark:bg-white/5">
                <Flag className="h-3 w-3" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as NotePriority)}
                  className="bg-transparent focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Stack selector */}
              {stacks.length > 0 && (
                <div className="flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-xs dark:bg-white/5">
                  <Layers className="h-3 w-3" />
                  <select
                    value={stackId || ""}
                    onChange={(e) => setStackId(e.target.value || null)}
                    className="bg-transparent focus:outline-none"
                  >
                    <option value="">No Stack</option>
                    {stacks.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Due date */}
              <div className="flex items-center gap-1 rounded-md bg-black/5 px-2 py-1 text-xs dark:bg-white/5">
                <Calendar className="h-3 w-3" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-transparent text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Tag add field & Save / Close */}
            <div className="flex items-center gap-2">
              <div className="hidden items-center sm:flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="#tag"
                  className="w-20 rounded-l-md border-r-0 bg-black/5 px-2 py-1 text-xs focus:outline-none dark:bg-white/5"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-r-md bg-black/10 px-1.5 py-1 text-xs hover:bg-black/20 dark:bg-white/10"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/10"
              >
                Close
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
