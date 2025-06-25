import { promises as fs } from "fs";
import path from "path";

export async function saveDocument(
  projectSlug: string,
  name: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const dir = path.join(process.cwd(), "data", "documents", projectSlug);
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, name);
    await fs.writeFile(filePath, content);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: `Failed to save ${name}` };
  }
}

export async function savePrd(
  projectSlug: string,
  content: string,
): Promise<{ success: boolean; error?: string }> {
  return saveDocument(projectSlug, "PRD.md", content);
}
