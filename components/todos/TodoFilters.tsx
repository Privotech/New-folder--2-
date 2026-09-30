"use client";

import React from "react";
import { CheckCheck, Trash2, Download, Filter, ArrowDownUp } from "lucide-react";

interface TodoFiltersProps {
  activeStatus: "all" | "active" | "completed";
  setActiveStatus: (st: "all" | "active" | "completed") => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedPriority: string;
  setSelectedPriority: (prio: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  categories: string[];
  selectedCount: number;
  totalVisible: number;
  onSelectAll: () => void;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onExport: () => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  activeStatus,
  setActiveStatus,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  categories,
  selectedCount,
  totalVisible,
  onSelectAll,
  onBulkComplete,
  onBulkDelete,
  onExport,
}) => {
  return (
    <div className="mb-4 space-y-3">
      {/* Primary Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
          {(["all", "active", "completed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStatus(tab)}
              className={`rounded-md px-3 py-1 text-xs font-semibold capitalize transition ${
                activeStatus === tab
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <span className="text-gray-400">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent focus:outline-none"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <span className="text-gray-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent focus:outline-none"
              >
                <option value="all">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <ArrowDownUp className="h-3 w-3 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none"
            >
              <option value="date">Newest</option>
              <option value="priority">Priority</option>
              <option value="duedate">Due Date</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>

          {/* Export */}
          <button
            onClick={onExport}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Export tasks to JSON"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-2 text-xs font-medium text-blue-900 dark:bg-blue-950/60 dark:text-blue-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onSelectAll}
              className="underline hover:text-blue-700 dark:hover:text-blue-100"
            >
              {selectedCount === totalVisible ? "Deselect All" : "Select All"}
            </button>
            <span>{selectedCount} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBulkComplete}
              className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-white hover:bg-emerald-700"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark Complete
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1 text-white hover:bg-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete Selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
