import path from "path";
import { promises as fs } from "fs";
import ProjectList from "@/components/projects/ProjectList";
import type { ProjectMetadata } from "@/lib/saveProjectMetadata";

interface ProjectItem {
  slug: string;
  data: ProjectMetadata;
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
          const data = JSON.parse(content) as ProjectMetadata;
          return { slug: file.replace(/\.json$/, ""), data };
        }),
    );
    return projects;
  } catch {
    return [];
  }
}

export default async function Page() {
  const projects = await getProjects();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📁 Projects</h1>
      <ProjectList projects={projects} />
    </div>
  );
}
