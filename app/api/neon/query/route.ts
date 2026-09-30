import { NextRequest, NextResponse } from "next/server";
import { executeNeonQuery } from "@/lib/neon";

export async function POST(req: NextRequest) {
  try {
    const { query, connectionString } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "SQL query string is required" },
        { status: 400 },
      );
    }

    const result = await executeNeonQuery(query, connectionString);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to execute SQL query",
      },
      { status: 500 },
    );
  }
}
