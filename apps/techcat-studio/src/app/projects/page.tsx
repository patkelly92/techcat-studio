import ProjectList from "@/components/projects/ProjectList";
import CTAButton from "@/components/ui/CTAButton";
import type { ProjectMetadata } from "@/lib/saveProjectMetadata";

interface ProjectItem {
  slug: string;
  data: ProjectMetadata;
}

async function getProjects(): Promise<ProjectItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    const projects = await res.json();
    return projects.map((p: any) => ({
      slug: p.slug,
      data: {
        name: p.name,
        description: p.description || "",
        tech_stack: "",
        created_at: p.created_at,
      } as ProjectMetadata,
    }));
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
