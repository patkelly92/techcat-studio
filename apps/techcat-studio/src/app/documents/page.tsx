import path from "path";
import { promises as fs } from "fs";
import DocumentsWrapper from "./DocumentsWrapper";

interface ProjectItem {
  slug: string;
  name: string;
}

async function getProjects(): Promise<ProjectItem[]> {
  const dir = path.join(process.cwd(), "data", "projects");
  try {
    const files = await fs.readdir(dir);
    const projects = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (file) => {
          const content = await fs.readFile(path.join(dir, file), "utf-8");
          const data = JSON.parse(content) as { name: string };
          return { slug: file.replace(/\.json$/, ""), name: data.name };
        }),
    );
    return projects;
  } catch {
    return [];
  }
}

export default async function Page() {
  const projects = await getProjects();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📄 Documents</h1>
      <DocumentsWrapper projects={projects} apiUrl={apiUrl} />
    </div>
  );
}
