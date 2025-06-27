import Link from "next/link";
import { notFound } from "next/navigation";
import type { ProjectMetadata } from "@/lib/saveProjectMetadata";
import ProjectDetail from "@/components/projects/ProjectDetail";

async function getProject(apiUrl: string, slug: string): Promise<ProjectMetadata | null> {
  try {
    const res = await fetch(`${apiUrl}/api/projects`, { cache: "no-store" });
    if (!res.ok) return null;
    const projects = await res.json();
    const p = projects.find((proj: any) => proj.slug === slug);
    if (!p) return null;
    return {
      name: p.name,
      description: p.description || "",
      tech_stack: "",
      created_at: p.created_at,
    } as ProjectMetadata;
  } catch {
    return null;
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const project = await getProject(apiUrl, slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <ProjectDetail project={project} />
      <Link href="/projects" className="text-blue-600 hover:underline">
        &larr; Back to Projects
      </Link>
    </div>
  );
}
