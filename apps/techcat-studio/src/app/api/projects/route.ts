import { NextResponse } from "next/server";
import { saveProjectMetadata } from "@/lib/saveProjectMetadata";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description = "", techStack = "" } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    const result = await saveProjectMetadata({ name, description, techStack });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: "Project saved", slug: result.slug });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to save project" },
      { status: 500 },
    );
  }
}
