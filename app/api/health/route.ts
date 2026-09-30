import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Welcome to PrivoKeep Next.js API!",
    version: "2.0",
    modules: ["auth", "notes", "projects", "reminders", "stacks", "todos"],
  });
}
