import { NextResponse } from "next/server";
import { saveDocument } from "@/lib/saveProjectDocument";

export async function POST(req: Request) {
  try {
    const { slug, name = "PRD.md", content } = await req.json();
    if (!slug || !content) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const result = await saveDocument(slug, name, content);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ message: "Document saved" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save document" },
      { status: 500 },
    );
  }
}
