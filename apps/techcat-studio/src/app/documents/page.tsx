import DocumentsWrapper from "./DocumentsWrapper";
import { Suspense } from "react";

interface ProjectItem {
  slug: string;
  name: string;
}

async function getProjects(apiUrl: string): Promise<ProjectItem[]> {
  try {
    const res = await fetch(`${apiUrl}/api/projects`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: any) => ({ slug: p.slug, name: p.name }));
  } catch {
    return [];
  }
}

export default async function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const projects = await getProjects(apiUrl);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📄 Documents</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <DocumentsWrapper projects={projects} apiUrl={apiUrl} />
      </Suspense>
    </div>
  );
}
