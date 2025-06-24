import path from "path";
import { promises as fs } from "fs";
import DocumentsSection from "@/components/documents/DocumentsSection";

interface ProjectItem {
  slug: string;
  name: string;
}

interface DocumentItem {
  title: string;
  content: string;
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

async function getDocuments(slug: string): Promise<DocumentItem[]> {
  const dir = path.join(process.cwd(), "data", "documents", slug);
  try {
    const files = await fs.readdir(dir);
    const docs = await Promise.all(
      files
        .filter((f) => f.endsWith(".md"))
        .map(async (file) => {
          const content = await fs.readFile(path.join(dir, file), "utf-8");
          return { title: file, content };
        }),
    );
    return docs;
  } catch {
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Page({ searchParams }: any) {
  const projects = await getProjects();
  const slug =
    typeof searchParams?.slug === "string" ? searchParams.slug : undefined;
  const documents = slug ? await getDocuments(slug) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">📄 Documents</h1>
      <DocumentsSection projects={projects} slug={slug} documents={documents} />
    </div>
  );
}
