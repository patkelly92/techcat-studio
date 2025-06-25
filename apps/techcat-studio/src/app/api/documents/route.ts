import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }
    const dir = path.join(process.cwd(), "data", "documents", slug);
    const files = await fs.readdir(dir);
    const documents = await Promise.all(
      files
        .filter((f) => f.endsWith(".md"))
        .map(async (file) => {
          const filePath = path.join(dir, file);
          const [content, stat] = await Promise.all([
            fs.readFile(filePath, "utf-8"),
            fs.stat(filePath),
          ]);
          return {
            title: file,
            content,
            lastModified: stat.mtime.toISOString(),
          };
        }),
    );
    return NextResponse.json({ documents });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to load documents" },
      { status: 500 },
    );
  }
}
