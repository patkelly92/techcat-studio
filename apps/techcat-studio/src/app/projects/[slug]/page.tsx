import path from "path";
import { promises as fs } from "fs";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ProjectMetadata } from "@/lib/saveProjectMetadata";
import ProjectDetail from "@/components/projects/ProjectDetail";

async function getProject(slug: string): Promise<ProjectMetadata | null> {
  const file = path.join(process.cwd(), "data", "projects", `${slug}.json`);
  try {
    const content = await fs.readFile(file, "utf-8");
    return JSON.parse(content) as ProjectMetadata;
  } catch {
    return null;
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = await getProject(slug);

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
