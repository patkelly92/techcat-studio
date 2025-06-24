"use client";

import { useRouter } from "next/navigation";
import ProjectSelector from "@/components/projects/ProjectSelector";
import DocumentCard from "./DocumentCard";

interface ProjectItem {
  slug: string;
  name: string;
}

interface DocumentItem {
  title: string;
  content: string;
}

interface DocumentsSectionProps {
  projects: ProjectItem[];
  slug?: string;
  documents: DocumentItem[];
}

const DocumentsSection = ({
  projects,
  slug,
  documents,
}: DocumentsSectionProps) => {
  const router = useRouter();

  const handleChange = (value: string) => {
    const query = value ? `?slug=${encodeURIComponent(value)}` : "";
    router.push(`/documents${query}`);
  };

  const isEmpty = slug ? documents.length === 0 : true;

  return (
    <div className="space-y-4">
      <ProjectSelector
        projects={projects}
        value={slug ?? ""}
        onChange={handleChange}
      />
      {slug ? (
        isEmpty ? (
          <p className="text-gray-600 dark:text-gray-400">
            No documents found for the selected project.
          </p>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.title}
                title={doc.title}
                content={doc.content}
              />
            ))}
          </div>
        )
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Select a project to view documents.
        </p>
      )}
    </div>
  );
};

export default DocumentsSection;
