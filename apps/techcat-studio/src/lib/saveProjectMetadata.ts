import { promises as fs } from "fs";
import path from "path";

const DEBUG_WRITE_FILES = process.env.NEXT_PUBLIC_DEBUG_WRITE_FILES === "true";

export interface ProjectMetadata {
  name: string;
  description: string;
  tech_stack: string;
  created_at: string;
}

export interface NewProjectInput {
  name: string;
  description: string;
  techStack: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function saveProjectMetadata({
  name,
  description,
  techStack,
}: NewProjectInput): Promise<{
  success: boolean;
  slug?: string;
  error?: string;
}> {
  const slug = slugify(name);
  const dir = path.join(process.cwd(), "data", "projects");
  const filePath = path.join(dir, `${slug}.json`);
  if (DEBUG_WRITE_FILES) {
    await fs.mkdir(dir, { recursive: true });
  }

  try {
    await fs.access(filePath);
    return { success: false, error: "Project already exists" };
  } catch {
    // file does not exist, continue
  }

  const metadata: ProjectMetadata = {
    name,
    description,
    tech_stack: techStack,
    created_at: new Date().toISOString(),
  };

  if (DEBUG_WRITE_FILES) {
    await fs.writeFile(filePath, JSON.stringify(metadata, null, 2));
  }
  return { success: true, slug };
}
