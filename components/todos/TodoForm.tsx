"use client";

import React, { useState } from "react";
import { Todo, SubTask } from "@/types";
import { Plus, Calendar, Flag, Folder, X, ListPlus } from "lucide-react";

interface TodoFormProps {
  onAddTodo: (todo: Partial<Todo>) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, { title: subtaskInput.trim(), completed: false }]);
      setSubtaskInput("");
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTodo({
      title: title.trim(),
      description: description.trim(),
      priority,
      category: category.trim() || "General",
      dueDate: dueDate || undefined,
      subtasks,
    });

    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("General");
    setDueDate("");
    setSubtasks([]);
    setSubtaskInput("");
    setIsExpanded(false);
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="flex cursor-pointer items-center justify-between p-3.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Plus className="h-4 w-4" />
            </div>
            <span>Add a new task...</span>
          </div>
          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-400 dark:bg-gray-800">
            Press to create
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title (e.g. Finish quarterly presentation)"
            autoFocus
            className="w-full bg-transparent text-base font-semibold text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description or notes..."
            rows={2}
            className="mt-2 w-full resize-none bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none dark:text-gray-300"
          />

          {/* Subtasks */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask())}
                placeholder="Add subtask and press enter..."
                className="w-full rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            {subtasks.length > 0 && (
              <ul className="mt-2 space-y-1">
                {subtasks.map((st, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between rounded bg-gray-50 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
                  >
                    <span>• {st.title}</span>
                    <button
                      type="button"
                      onClick={() => removeSubtask(idx)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Options Row */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Priority */}
              <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <Flag className="h-3 w-3 text-gray-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="bg-transparent focus:outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* Category */}
              <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <Folder className="h-3 w-3 text-gray-400" />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Category"
                  className="w-20 bg-transparent focus:outline-none"
                />
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <Calendar className="h-3 w-3 text-gray-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
