"use client";

import React, { useState } from "react";
import { Note } from "@/types";
import { X, Copy, Check, Share2, Download } from "lucide-react";

interface ShareModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ note, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !note) return null;

  const shareText = `${note.title}\n\n${note.content || ""}\n\nCategory: ${note.category} | Priority: ${note.priority}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(note, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Share2 className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Share Note</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{note.title}</h4>
            <p className="mt-1 line-clamp-3 text-xs text-gray-600 dark:text-gray-400">
              {note.content || "No content"}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCopyContent}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied Content!" : "Copy Note Text"}
            </button>

            <button
              onClick={handleCopyLink}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Share2 className="h-3.5 w-3.5" />
              Copy Shareable Link
            </button>

            <button
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download className="h-3.5 w-3.5" />
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
