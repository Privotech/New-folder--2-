import { NextResponse } from "next/server";

let memoryTodos: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: memoryTodos.length,
    todos: memoryTodos,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTodo = {
      _id: `todo-${Date.now()}`,
      ...body,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryTodos.unshift(newTodo);
    return NextResponse.json({ success: true, todo: newTodo }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
