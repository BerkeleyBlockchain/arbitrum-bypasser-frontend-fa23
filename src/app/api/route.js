import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const data = { message: "Hello from Next.js!" };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
