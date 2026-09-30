import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    user: {
      id: "user-1",
      username: "privilege",
      name: "Oyegbile Privilege",
      email: "privilege@privokeep.app",
    },
  });
}
