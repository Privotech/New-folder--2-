"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Play,
  Copy,
  Check,
  RotateCcw,
  Download,
  Terminal,
  Server,
  Key,
  Layers,
  Table as TableIcon,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Code2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Note, Todo } from "@/types";

interface NeonConsoleProps {
  notes: Note[];
  todos: Todo[];
}

interface TableColumn {
  name: string;
  type: string;
  isPk?: boolean;
}

interface TableSchema {
  tableName: string;
  rowCount: number | string;
  columns: TableColumn[];
}

const DEFAULT_SNIPPETS = [
  {
    name: "All Notes (Pinned First)",
    sql: "SELECT id, title, category, priority, is_pinned FROM notes ORDER BY is_pinned DESC;",
  },
  {
    name: "Active Tasks",
    sql: "SELECT id, title, priority, due_date, completed FROM todos WHERE completed = false ORDER BY created_at DESC;",
  },
  {
    name: "Task Summary by Status",
    sql: "SELECT completed, COUNT(*) as total FROM todos GROUP BY completed;",
  },
  {
    name: "Notes by Category",
    sql: "SELECT category, COUNT(*) as count FROM notes GROUP BY category ORDER BY count DESC;",
  },
  {
    name: "Insert Note Template",
    sql: "INSERT INTO notes (id, title, content, color, category, priority, is_pinned) VALUES ('note-' || substr(md5(random()::text), 1, 8), 'Quick SQL Note', 'Created directly from Neon Console', 'yellow', 'ideas', 'high', true);",
  },
  {
    name: "Insert Task Template",
    sql: "INSERT INTO todos (id, title, description, priority, category, completed) VALUES ('todo-' || substr(md5(random()::text), 1, 8), 'Test PostgreSQL Queries', 'Verify Neon DB queries execute cleanly', 'high', 'Engineering', false);",
  },
  {
    name: "PostgreSQL Version",
    sql: "SELECT version();",
  },
  {
    name: "Inspect Tables & Columns",
    sql: "SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position;",
  },
];

export const NeonConsole: React.FC<NeonConsoleProps> = ({ notes, todos }) => {
  const [query, setQuery] = useState("SELECT * FROM notes ORDER BY is_pinned DESC;");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    rows: any[];
    rowCount: number;
    fields: string[];
    executionTimeMs: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionString, setConnectionString] = useState("");
  const [showConnModal, setShowConnModal] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "json">("table");
  const [copied, setCopied] = useState(false);
  const [schemas, setSchemas] = useState<TableSchema[]>([]);
  const [expandedTable, setExpandedTable] = useState<string | null>("notes");

  // Load saved connection string if any
  useEffect(() => {
    const saved = localStorage.getItem("neon_conn_str");
    if (saved) setConnectionString(saved);

    // Fetch initial schemas
    fetch("/api/neon/schema")
      .then((r) => r.json())
      .then((data) => {
        if (data.schema) setSchemas(data.schema);
      })
      .catch(() => {});

    // Initial query run
    runQuery("SELECT * FROM notes ORDER BY is_pinned DESC;");
  }, []);

  const handleSaveConnection = (val: string) => {
    setConnectionString(val.trim());
    if (val.trim()) {
      localStorage.setItem("neon_conn_str", val.trim());
    } else {
      localStorage.removeItem("neon_conn_str");
    }
    setShowConnModal(false);
  };

  const runQuery = async (sqlToRun?: string) => {
    const sql = (sqlToRun || query).trim();
    if (!sql) return;

    setIsRunning(true);
    setError(null);

    try {
      const res = await fetch("/api/neon/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: sql,
          connectionString: connectionString || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to execute SQL statement");
      }

      setResult({
        rows: data.rows || [],
        rowCount: data.rowCount || (data.rows ? data.rows.length : 0),
        fields: data.fields || (data.rows && data.rows.length > 0 ? Object.keys(data.rows[0]) : []),
        executionTimeMs: data.executionTimeMs || 15,
      });

      // Update history
      setHistory((prev) => [sql, ...prev.filter((h) => h !== sql)].slice(0, 10));
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during SQL execution");
      setResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  const handleInitSchema = async () => {
    const initSql = `-- Initialize PrivoKeep Schema
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT 'default',
  category TEXT DEFAULT 'personal',
  priority TEXT DEFAULT 'medium',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'General',
  due_date TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;
    setQuery(initSql);
    await runQuery(initSql);
  };

  const handleExportCsv = () => {
    if (!result || !result.rows.length) return;
    const headers = result.fields.join(",");
    const rows = result.rows.map((r) =>
      result.fields
        .map((f) => {
          const val = r[f];
          if (val === null || val === undefined) return "";
          const str = typeof val === "object" ? JSON.stringify(val) : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `neon-query-result-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSyncAppData = async () => {
    // Generate SQL statements from user notes and todos
    const noteStatements = notes.map((n) => {
      const escTitle = n.title.replace(/'/g, "''");
      const escContent = (n.content || "").replace(/'/g, "''");
      const escColor = (n.color || "default").replace(/'/g, "''");
      const escCategory = (n.category || "personal").replace(/'/g, "''");
      const escPriority = (n.priority || "medium").replace(/'/g, "''");
      const isPinned = n.isPinned ? "TRUE" : "FALSE";
      const isArchived = n.isArchived ? "TRUE" : "FALSE";
      return `INSERT INTO notes (id, title, content, color, category, priority, is_pinned, is_archived) VALUES ('${n._id}', '${escTitle}', '${escContent}', '${escColor}', '${escCategory}', '${escPriority}', ${isPinned}, ${isArchived}) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, is_pinned = EXCLUDED.is_pinned;`;
    });

    const todoStatements = todos.map((t) => {
      const escTitle = t.title.replace(/'/g, "''");
      const escDesc = (t.description || "").replace(/'/g, "''");
      const escPri = (t.priority || "medium").replace(/'/g, "''");
      const escCat = (t.category || "General").replace(/'/g, "''");
      const completed = t.completed ? "TRUE" : "FALSE";
      return `INSERT INTO todos (id, title, description, priority, category, completed) VALUES ('${t._id}', '${escTitle}', '${escDesc}', '${escPri}', '${escCat}', ${completed}) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, completed = EXCLUDED.completed;`;
    });

    const fullBatchSql = [
      `-- Syncing ${notes.length} Notes and ${todos.length} Tasks to PostgreSQL`,
      ...noteStatements,
      ...todoStatements,
      `SELECT 'Sync completed: ${notes.length} notes, ${todos.length} tasks synced' AS result;`,
    ].join("\n");

    setQuery(fullBatchSql);
    await runQuery(fullBatchSql);
  };

  const handleDownloadSqlDump = () => {
    const dumpLines = [
      `-- ===================================================`,
      `-- PrivoKeep Neon PostgreSQL Database Dump`,
      `-- Exported At: ${new Date().toISOString()}`,
      `-- ===================================================`,
      ``,
      `-- 1. Create Tables`,
      `CREATE TABLE IF NOT EXISTS notes (`,
      `  id TEXT PRIMARY KEY,`,
      `  title TEXT NOT NULL,`,
      `  content TEXT,`,
      `  color TEXT DEFAULT 'default',`,
      `  category TEXT DEFAULT 'personal',`,
      `  priority TEXT DEFAULT 'medium',`,
      `  is_pinned BOOLEAN DEFAULT FALSE,`,
      `  is_archived BOOLEAN DEFAULT FALSE,`,
      `  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`,
      `);`,
      ``,
      `CREATE TABLE IF NOT EXISTS todos (`,
      `  id TEXT PRIMARY KEY,`,
      `  title TEXT NOT NULL,`,
      `  description TEXT,`,
      `  priority TEXT DEFAULT 'medium',`,
      `  category TEXT DEFAULT 'General',`,
      `  due_date TEXT,`,
      `  completed BOOLEAN DEFAULT FALSE,`,
      `  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`,
      `);`,
      ``,
      `-- 2. Notes Data`,
      ...notes.map(
        (n) =>
          `INSERT INTO notes (id, title, content, color, category, priority, is_pinned, is_archived) VALUES ('${n._id}', '${n.title.replace(/'/g, "''")}', '${(n.content || "").replace(/'/g, "''")}', '${n.color}', '${n.category}', '${n.priority}', ${n.isPinned ? "TRUE" : "FALSE"}, ${n.isArchived ? "TRUE" : "FALSE"}) ON CONFLICT (id) DO NOTHING;`,
      ),
      ``,
      `-- 3. Todos Data`,
      ...todos.map(
        (t) =>
          `INSERT INTO todos (id, title, description, priority, category, completed) VALUES ('${t._id}', '${t.title.replace(/'/g, "''")}', '${(t.description || "").replace(/'/g, "''")}', '${t.priority}', '${t.category}', ${t.completed ? "TRUE" : "FALSE"}) ON CONFLICT (id) DO NOTHING;`,
      ),
    ];

    const blob = new Blob([dumpLines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `privokeep-neon-dump-${Date.now()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefreshSchema = async () => {
    try {
      const res = await fetch("/api/neon/schema" + (connectionString ? `?connectionString=${encodeURIComponent(connectionString)}` : ""));
      const data = await res.json();
      if (data.schema) setSchemas(data.schema);
    } catch {}
  };

  return (
    <div className="flex flex-col rounded-2xl border border-gray-800 bg-[#0d1117] text-gray-200 shadow-2xl">
      {/* Neon Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 bg-[#161b22] px-6 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-gray-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-tight">
                Neon <span className="text-emerald-400">PostgreSQL Console</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                v17.2 Serverless
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Interactive SQL Editor & Database Manager for PrivoKeep
            </p>
          </div>
        </div>

        {/* Connection Status & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            onClick={() => setShowConnModal(true)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 bg-gray-900/80 px-3 py-1.5 text-xs text-gray-300 transition hover:border-emerald-500/50"
            title="Configure Neon Connection URL"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                connectionString ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-teal-400"
              }`}
            />
            <span className="font-mono text-[11px]">
              {connectionString ? "Connected to Neon DB" : "Local PostgreSQL Engine"}
            </span>
            <Key className="h-3 w-3 text-gray-400" />
          </div>

          <button
            onClick={handleSyncAppData}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-800/60 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-900/60"
            title="Sync all active notes and tasks into PostgreSQL"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Sync App Data</span>
          </button>

          <button
            onClick={handleDownloadSqlDump}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-gray-700"
            title="Download complete PostgreSQL dump file"
          >
            <Download className="h-3.5 w-3.5 text-blue-400" />
            <span>Export .sql</span>
          </button>

          <button
            onClick={handleInitSchema}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:bg-gray-700"
            title="Create tables in PostgreSQL"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Init Schema</span>
          </button>
        </div>
      </div>

      {/* Main Console Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* Left Sidebar: Schema Explorer & Snippets */}
        <div className="border-b border-gray-800 bg-[#0d1117] p-4 lg:border-r lg:border-b-0">
          {/* Tables Explorer */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider text-gray-400 uppercase">
              <span className="flex items-center gap-1.5">
                <TableIcon className="h-3.5 w-3.5 text-emerald-400" />
                Tables
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleRefreshSchema}
                  title="Refresh table schema"
                  className="rounded p-0.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
                <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-400">
                  {schemas.length}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {schemas.map((t) => (
                <div key={t.tableName} className="rounded-lg bg-gray-900/60 p-2 text-xs">
                  <div
                    onClick={() =>
                      setExpandedTable(expandedTable === t.tableName ? null : t.tableName)
                    }
                    className="flex cursor-pointer items-center justify-between font-mono font-medium text-gray-300 hover:text-emerald-400"
                  >
                    <div className="flex items-center gap-1.5">
                      {expandedTable === t.tableName ? (
                        <ChevronDown className="h-3 w-3 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-gray-500" />
                      )}
                      <span>public.{t.tableName}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{t.rowCount} rows</span>
                  </div>

                  {expandedTable === t.tableName && t.columns && (
                    <div className="mt-2 space-y-1 pl-4 border-l border-gray-800">
                      {t.columns.map((c) => (
                        <div key={c.name} className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-400">
                            {c.name} {c.isPk && <span className="text-amber-400 font-bold">PK</span>}
                          </span>
                          <span className="font-mono text-gray-600">{c.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Snippets */}
          <div>
            <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              <span>Quick SQL Queries</span>
            </div>
            <div className="space-y-1">
              {DEFAULT_SNIPPETS.map((snip) => (
                <button
                  key={snip.name}
                  onClick={() => {
                    setQuery(snip.sql);
                    runQuery(snip.sql);
                  }}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-gray-400 transition hover:bg-gray-800 hover:text-emerald-300"
                >
                  <span>{snip.name}</span>
                  <Code2 className="h-3 w-3 text-gray-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Query History */}
          {history.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                <span>Recent History</span>
              </div>
              <div className="space-y-1">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(h);
                      runQuery(h);
                    }}
                    className="block w-full truncate rounded px-2 py-1 text-left font-mono text-[11px] text-gray-500 transition hover:bg-gray-800 hover:text-gray-300"
                    title={h}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Editor & Results */}
        <div className="flex flex-col lg:col-span-3">
          {/* SQL Editor Area */}
          <div className="border-b border-gray-800 bg-[#161b22] p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                <Terminal className="h-3.5 w-3.5" />
                SQL Query Editor
              </span>
              <span className="text-[11px] text-gray-500">
                Press <kbd className="rounded bg-gray-800 px-1 text-gray-300">Cmd / Ctrl + Enter</kbd> to run
              </span>
            </div>

            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    runQuery();
                  }
                }}
                rows={5}
                className="w-full rounded-xl border border-gray-700 bg-[#0d1117] p-3 font-mono text-sm text-gray-100 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Write standard PostgreSQL statement (e.g. SELECT * FROM notes;)..."
              />
            </div>

            {/* Run Actions Bar */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => runQuery()}
                  disabled={isRunning}
                  className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:outline-none disabled:opacity-50"
                >
                  <Play className={`h-3.5 w-3.5 ${isRunning ? "animate-spin" : "fill-current"}`} />
                  <span>{isRunning ? "Executing..." : "Run Query"}</span>
                </button>

                <button
                  onClick={() => setQuery("")}
                  className="rounded-lg border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-gray-800 hover:text-white"
                >
                  Clear
                </button>
              </div>

              {result && (
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1 font-mono text-emerald-400">
                    <Clock className="h-3.5 w-3.5" />
                    {result.executionTimeMs}ms
                  </span>
                  <span>{result.rowCount} rows</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 p-4">
            {error ? (
              <div className="flex items-start gap-3 rounded-xl border border-rose-900/60 bg-rose-950/40 p-4 text-xs text-rose-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                <div>
                  <h5 className="font-semibold text-rose-200">PostgreSQL Execution Error</h5>
                  <pre className="mt-1 font-mono whitespace-pre-wrap">{error}</pre>
                </div>
              </div>
            ) : result ? (
              <div>
                {/* Result Toolbar */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                        viewMode === "table"
                          ? "bg-gray-800 text-emerald-400 shadow-sm"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      Table View
                    </button>
                    <button
                      onClick={() => setViewMode("json")}
                      className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                        viewMode === "json"
                          ? "bg-gray-800 text-emerald-400 shadow-sm"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      Raw JSON
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCsv}
                      className="flex items-center gap-1 rounded border border-gray-700 px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 hover:text-white"
                      title="Export CSV"
                    >
                      <Download className="h-3 w-3" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {/* Table View */}
                {viewMode === "table" ? (
                  result.rows.length === 0 ? (
                    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-8 text-center text-xs text-gray-500">
                      Query returned 0 rows or executed non-returning statement successfully.
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-x-auto overflow-y-auto rounded-xl border border-gray-800">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="sticky top-0 bg-gray-900 text-gray-400 border-b border-gray-800">
                          <tr>
                            {result.fields.map((field) => (
                              <th key={field} className="px-4 py-2.5 font-semibold">
                                {field}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/80 bg-[#0d1117]">
                          {result.rows.map((row, idx) => (
                            <tr key={idx} className="transition hover:bg-gray-900/60">
                              {result.fields.map((field) => {
                                const val = row[field];
                                return (
                                  <td
                                    key={field}
                                    className="px-4 py-2 text-gray-300 whitespace-nowrap"
                                  >
                                    {val === null || val === undefined ? (
                                      <span className="text-gray-600 italic">null</span>
                                    ) : typeof val === "boolean" ? (
                                      <span
                                        className={
                                          val ? "text-emerald-400 font-bold" : "text-rose-400"
                                        }
                                      >
                                        {val ? "true" : "false"}
                                      </span>
                                    ) : typeof val === "object" ? (
                                      JSON.stringify(val)
                                    ) : (
                                      String(val)
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  /* JSON View */
                  <pre className="max-h-96 overflow-auto rounded-xl border border-gray-800 bg-[#0d1117] p-4 font-mono text-xs text-emerald-300">
                    {JSON.stringify(result.rows, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 p-12 text-center text-xs text-gray-500">
                <Database className="h-8 w-8 text-gray-700 mb-2" />
                <p>Run a query above or click a quick snippet to view results.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection String Modal */}
      {showConnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-2xl text-gray-200">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Neon PostgreSQL Credentials</h3>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Provide your Neon Database Connection String (or leave blank to use the built-in local PostgreSQL engine).
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                PostgreSQL Connection URL
              </label>
              <input
                type="text"
                defaultValue={connectionString}
                id="neon-conn-input"
                placeholder="postgresql://neondb_owner:password@ep-name.eu-central-1.aws.neon.tech/neondb?sslmode=require"
                className="w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2 font-mono text-xs text-white placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
              />
              <p className="mt-1.5 text-[11px] text-gray-500">
                You can copy your connection string directly from your{" "}
                <a
                  href="https://console.neon.tech"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 underline"
                >
                  Neon Console
                </a>
                .
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-800 pt-4">
              <button
                type="button"
                onClick={() => handleSaveConnection("")}
                className="rounded-lg px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                Use Local Engine
              </button>
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("neon-conn-input") as HTMLInputElement;
                  handleSaveConnection(input ? input.value : "");
                }}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Save Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
