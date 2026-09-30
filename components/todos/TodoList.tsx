"use client";

import React, { useState } from "react";
import { Todo } from "@/types";
import {
  Check,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronRight,
  Flag,
  Folder,
} from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  selectedTodoIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onToggleSubtask: (todoId: string, subtaskIndex: number) => void;
  onDeleteTodo: (id: string) => void;
}

const PRIORITY_STYLES = {
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  medium: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  high: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  selectedTodoIds,
  onToggleSelect,
  onToggleComplete,
  onToggleSubtask,
  onDeleteTodo,
}) => {
  const [expandedSubtasks, setExpandedSubtasks] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedSubtasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="text-3xl">🎯</div>
        <h4 className="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-200">No tasks found</h4>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Try clearing filters or add a new task above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {todos.map((todo) => {
        const isSelected = selectedTodoIds.includes(todo._id);
        const subtasksCount = todo.subtasks?.length || 0;
        const completedSubtasks = todo.subtasks?.filter((st) => st.completed).length || 0;
        const isExpanded = !!expandedSubtasks[todo._id];

        const isOverdue =
          todo.dueDate &&
          !todo.completed &&
          new Date(todo.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

        return (
          <div
            key={todo._id}
            className={`group rounded-xl border p-3.5 shadow-sm transition-all duration-150 ${
              todo.completed
                ? "border-gray-200 bg-gray-50/60 opacity-80 dark:border-gray-800 dark:bg-gray-900/40"
                : isSelected
                ? "border-blue-400 bg-blue-50/40 dark:border-blue-700 dark:bg-blue-950/20"
                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Bulk Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(todo._id)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
              />

              {/* Complete Circle Button */}
              <button
                type="button"
                onClick={() => onToggleComplete(todo._id)}
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  todo.completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-300 hover:border-emerald-500 dark:border-gray-600"
                }`}
              >
                {todo.completed && <Check className="h-3 w-3 stroke-[3]" />}
              </button>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4
                    className={`text-sm font-semibold transition ${
                      todo.completed
                        ? "text-gray-400 line-through dark:text-gray-500"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {todo.title}
                  </h4>

                  {/* Priority */}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
                      PRIORITY_STYLES[todo.priority]
                    }`}
                  >
                    {todo.priority}
                  </span>

                  {/* Category */}
                  {todo.category && (
                    <span className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      <Folder className="h-2.5 w-2.5" />
                      {todo.category}
                    </span>
                  )}

                  {/* Due Date */}
                  {todo.dueDate && (
                    <span
                      className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        isOverdue
                          ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <Calendar className="h-2.5 w-2.5" />
                      {todo.dueDate} {isOverdue ? "(Overdue)" : ""}
                    </span>
                  )}
                </div>

                {todo.description && (
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    {todo.description}
                  </p>
                )}

                {/* Subtasks summary trigger */}
                {subtasksCount > 0 && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(todo._id)}
                      className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      <span>
                        Subtasks: {completedSubtasks}/{subtasksCount}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
                        {todo.subtasks.map((st, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => onToggleSubtask(todo._id, idx)}
                              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                            />
                            <span
                              className={`text-xs ${
                                st.completed
                                  ? "text-gray-400 line-through dark:text-gray-500"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onDeleteTodo(todo._id)}
                  className="rounded p-1 text-gray-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100 dark:hover:text-red-400"
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
