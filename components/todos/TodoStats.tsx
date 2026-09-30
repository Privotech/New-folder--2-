"use client";

import React from "react";
import { Todo } from "@/types";
import { CheckCircle2, Clock, Calendar, CheckSquare, TrendingUp } from "lucide-react";

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const dueToday = todos.filter(
    (t) => !t.completed && t.dueDate && t.dueDate === todayStr,
  ).length;

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {/* Total */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
          <CheckSquare className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{total}</p>
        </div>
      </div>

      {/* Completed */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{completed}</p>
        </div>
      </div>

      {/* Active */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
          <Clock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{active}</p>
        </div>
      </div>

      {/* Due Today */}
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Due Today</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{dueToday}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="col-span-2 flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm sm:col-span-4 lg:col-span-1 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
            Rate
          </span>
          <span className="font-bold text-gray-900 dark:text-white">{completionRate}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
