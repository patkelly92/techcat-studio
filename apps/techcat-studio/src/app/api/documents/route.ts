import { NextResponse } from "next/server";
import { savePrd } from "@/lib/saveProjectDocument";

export async function POST(req: Request) {
  try {
    const { slug, content } = await req.json();
    if (!slug || !content) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const result = await savePrd(slug, content);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ message: "PRD saved" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save PRD" }, { status: 500 });
  }
}
