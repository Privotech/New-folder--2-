"use client";

import React from "react";
import { User } from "@/types";
import {
  FileText,
  CheckSquare,
  Search,
  Moon,
  Sun,
  LogOut,
  User as UserIcon,
} from "lucide-react";

interface NavbarProps {
  activeTab: "notes" | "todos" | "neon";
  setActiveTab: (tab: "notes" | "todos" | "neon") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode,
  user,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand & Suite Switcher */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Privo<span className="text-blue-600 dark:text-blue-400">Keep</span>
            </span>
          </div>

          <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3.5 ${
                activeTab === "notes"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Notes</span>
            </button>
            <button
              onClick={() => setActiveTab("todos")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3.5 ${
                activeTab === "todos"
                  ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab("neon")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all sm:px-3.5 ${
                activeTab === "neon"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden xs:inline">Neon DB</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative max-w-[130px] flex-1 sm:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "notes" ? "Search notes, tags, contents..." : "Search tasks, tags..."
            }
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-1.5 pr-4 pl-9 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-400 dark:focus:bg-gray-900"
          />
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Mobile view switch */}
          <div className="flex sm:hidden">
            <button
              onClick={() => setActiveTab(activeTab === "notes" ? "todos" : "notes")}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              title="Toggle View"
            >
              {activeTab === "notes" ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {user && (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-2 dark:border-gray-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                {user.username ? user.username.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
              </div>
              <span className="hidden text-xs font-medium text-gray-700 md:inline-block dark:text-gray-300">
                {user.name || user.username}
              </span>
              <button
                onClick={onLogout}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
