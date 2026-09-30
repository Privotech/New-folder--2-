import { neon } from "@neondatabase/serverless";

export interface QueryResult {
  rows: any[];
  rowCount: number;
  fields: string[];
  executionTimeMs: number;
}

// In-memory mock database for fallback when no live Neon DB is connected
let mockTables: Record<string, any[]> = {
  notes: [
    {
      id: "note-1",
      title: "Welcome to PrivoKeep Suite",
      content: "Google Keep-style cards with task management.",
      color: "yellow",
      category: "ideas",
      priority: "high",
      tags: ["welcome", "guide"],
      is_pinned: true,
      is_archived: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "note-2",
      title: "Next.js & Tailwind Architecture",
      content: "Migrated to Next.js 15, App Router, TypeScript, and Tailwind CSS.",
      color: "blue",
      category: "work",
      priority: "medium",
      tags: ["nextjs", "typescript"],
      is_pinned: true,
      is_archived: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "note-3",
      title: "Design System Tokens",
      content: "Pastel color palettes with clean borders.",
      color: "pink",
      category: "research",
      priority: "low",
      tags: ["design", "colors"],
      is_pinned: false,
      is_archived: false,
      created_at: new Date().toISOString(),
    },
  ],
  todos: [
    {
      id: "todo-1",
      title: "Review Next.js project migration",
      description: "Verify TypeScript compilation and Tailwind CSS styling.",
      priority: "high",
      category: "Engineering",
      due_date: "2026-10-01",
      completed: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "todo-2",
      title: "Connect Neon PostgreSQL database",
      description: "Support Neon serverless connection and interactive query console.",
      priority: "high",
      category: "Database",
      due_date: "2026-10-02",
      completed: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "todo-3",
      title: "Test dark mode & mobile navigation",
      description: "Verify UI responsive layouts.",
      priority: "low",
      category: "Quality",
      due_date: "2026-10-05",
      completed: false,
      created_at: new Date().toISOString(),
    },
  ],
  stacks: [
    {
      id: "stack-1",
      name: "Engineering & Architecture",
      color: "#3b82f6",
      is_pinned: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "stack-2",
      name: "Product Design & Ideas",
      color: "#10b981",
      is_pinned: false,
      created_at: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "user-1",
      username: "privilege",
      email: "privilege@privokeep.app",
      name: "Oyegbile Privilege",
      created_at: new Date().toISOString(),
    },
  ],
};

export const INITIAL_NEON_SCHEMA_SQL = `-- PrivoKeep PostgreSQL Schema on Neon
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stacks (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  color TEXT DEFAULT 'default',
  category TEXT DEFAULT 'personal',
  priority TEXT DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  is_favorited BOOLEAN DEFAULT FALSE,
  stack_id TEXT REFERENCES stacks(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  category TEXT DEFAULT 'General',
  due_date TEXT,
  completed BOOLEAN DEFAULT FALSE,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

export async function executeNeonQuery(
  sqlQuery: string,
  connectionString?: string,
): Promise<QueryResult> {
  const start = performance.now();
  const connStr = connectionString || process.env.DATABASE_URL;

  // If a live connection string is provided, query Neon via @neondatabase/serverless
  if (connStr && connStr.startsWith("postgres")) {
    try {
      const sql: any = neon(connStr);
      const rows = (await sql([sqlQuery] as any)) as any[];
      const elapsed = Math.round(performance.now() - start);
      const fields = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        rows,
        rowCount: rows.length,
        fields,
        executionTimeMs: elapsed,
      };
    } catch (err: any) {
      throw new Error(`Neon PostgreSQL Error: ${err.message}`);
    }
  }

  // Local simulated PostgreSQL query engine for immediate offline console execution
  await new Promise((r) => setTimeout(r, 45)); // simulate realistic query network latency
  const trimmed = sqlQuery.trim().replace(/;$/, "");
  const lower = trimmed.toLowerCase();

  let rows: any[] = [];

  if (lower.startsWith("select")) {
    const fromMatch = trimmed.match(/from\s+([a-zA-Z0-9_]+)/i);
    const tableName = fromMatch ? fromMatch[1].toLowerCase() : "";

    if (tableName && mockTables[tableName]) {
      rows = [...mockTables[tableName]];

      // Handle simple where completed = false / true
      if (lower.includes("where completed = false")) {
        rows = rows.filter((r) => r.completed === false);
      } else if (lower.includes("where completed = true")) {
        rows = rows.filter((r) => r.completed === true);
      } else if (lower.includes("where is_pinned = true")) {
        rows = rows.filter((r) => r.is_pinned === true);
      }

      // Handle simple order by
      if (lower.includes("order by is_pinned desc")) {
        rows.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));
      }
    } else if (lower.includes("version()")) {
      rows = [{ version: "PostgreSQL 17.2 on Neon Serverless (x86_64-pc-linux-gnu)" }];
    } else if (lower.includes("current_database()")) {
      rows = [{ current_database: "neondb" }];
    } else {
      rows = [{ message: "Query executed successfully on local PostgreSQL engine." }];
    }
  } else if (lower.startsWith("insert into")) {
    rows = [{ status: "INSERT 0 1", affectedRows: 1 }];
  } else if (lower.startsWith("update")) {
    rows = [{ status: "UPDATE 1", affectedRows: 1 }];
  } else if (lower.startsWith("delete")) {
    rows = [{ status: "DELETE 1", affectedRows: 1 }];
  } else if (lower.startsWith("create table")) {
    rows = [{ status: "CREATE TABLE", message: "Table created successfully." }];
  } else {
    rows = [{ status: "COMMAND OK", query: trimmed }];
  }

  const elapsed = Math.round(performance.now() - start);
  const fields = rows.length > 0 ? Object.keys(rows[0]) : [];

  return {
    rows,
    rowCount: rows.length,
    fields,
    executionTimeMs: elapsed,
  };
}

export function getMockSchema() {
  return [
    {
      tableName: "notes",
      rowCount: mockTables.notes.length,
      columns: [
        { name: "id", type: "text", isPk: true },
        { name: "title", type: "text", isPk: false },
        { name: "content", type: "text", isPk: false },
        { name: "color", type: "text", isPk: false },
        { name: "category", type: "text", isPk: false },
        { name: "priority", type: "text", isPk: false },
        { name: "tags", type: "text[]", isPk: false },
        { name: "is_pinned", type: "boolean", isPk: false },
        { name: "created_at", type: "timestamptz", isPk: false },
      ],
    },
    {
      tableName: "todos",
      rowCount: mockTables.todos.length,
      columns: [
        { name: "id", type: "text", isPk: true },
        { name: "title", type: "text", isPk: false },
        { name: "description", type: "text", isPk: false },
        { name: "priority", type: "text", isPk: false },
        { name: "category", type: "text", isPk: false },
        { name: "due_date", type: "text", isPk: false },
        { name: "completed", type: "boolean", isPk: false },
        { name: "created_at", type: "timestamptz", isPk: false },
      ],
    },
    {
      tableName: "stacks",
      rowCount: mockTables.stacks.length,
      columns: [
        { name: "id", type: "text", isPk: true },
        { name: "name", type: "text", isPk: false },
        { name: "color", type: "text", isPk: false },
        { name: "is_pinned", type: "boolean", isPk: false },
        { name: "created_at", type: "timestamptz", isPk: false },
      ],
    },
    {
      tableName: "users",
      rowCount: mockTables.users.length,
      columns: [
        { name: "id", type: "text", isPk: true },
        { name: "username", type: "text", isPk: false },
        { name: "email", type: "text", isPk: false },
        { name: "name", type: "text", isPk: false },
        { name: "created_at", type: "timestamptz", isPk: false },
      ],
    },
  ];
}
