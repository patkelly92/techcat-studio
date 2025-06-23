import path from "path";
import { promises as fs } from "fs";
import ProjectList from "@/components/projects/ProjectList";
import CTAButton from "@/components/ui/CTAButton";
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
  const isEmpty = projects.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">📁 Projects</h1>
        <CTAButton href="/projects/new" className="w-full sm:w-auto">
          Create New Project
        </CTAButton>
      </div>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No projects found. Create your first project to get started.
          </p>
          <CTAButton href="/projects/new">Create Project</CTAButton>
        </div>
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
