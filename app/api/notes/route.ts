import { NextResponse } from "next/server";

// In-memory fallback notes store
let memoryNotes: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: memoryNotes.length,
    notes: memoryNotes,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNote = {
      _id: `note-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryNotes.unshift(newNote);
    return NextResponse.json({ success: true, note: newNote }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
