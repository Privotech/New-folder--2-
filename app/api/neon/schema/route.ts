import { NextRequest, NextResponse } from "next/server";
import { getMockSchema, INITIAL_NEON_SCHEMA_SQL, executeNeonQuery } from "@/lib/neon";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const connStr = url.searchParams.get("connectionString") || undefined;

  // If live Neon DB, query information_schema.tables
  if (connStr || process.env.DATABASE_URL) {
    try {
      const q = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `;
      const res = await executeNeonQuery(q, connStr);
      return NextResponse.json({
        success: true,
        schema: res.rows.map((r: any) => ({
          tableName: r.table_name,
          rowCount: "-",
          columns: [],
        })),
        initialSchemaSql: INITIAL_NEON_SCHEMA_SQL,
      });
    } catch {
      // Fallback to default schema
    }
  }

  return NextResponse.json({
    success: true,
    schema: getMockSchema(),
    initialSchemaSql: INITIAL_NEON_SCHEMA_SQL,
  });
}
