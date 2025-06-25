"use client";

import { memo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectSelector from "@/components/projects/ProjectSelector";
import DocumentCard from "./DocumentCard";
import GenerateArchitectureCard from "./GenerateArchitectureCard";

interface ProjectItem {
  slug: string;
  name: string;
}

interface DocumentItem {
  title: string;
  content: string;
  lastModified: string;
}

interface DocumentsSectionProps {
  projects: ProjectItem[];
  slug?: string;
  documents: DocumentItem[];
  apiUrl: string;
}

const DocumentsSectionComponent = ({
  projects,
  slug,
  documents,
  apiUrl,
}: DocumentsSectionProps) => {
  const router = useRouter();
  const [docs, setDocs] = useState<DocumentItem[]>(documents);

  const handleChange = useCallback(
    (value: string) => {
      const query = value ? `?slug=${encodeURIComponent(value)}` : "";
      router.push(`/documents${query}`);
    },
    [router],
  );

  const isEmpty = slug ? docs.length === 0 : true;
  const hasPrd = docs.some((d) => d.title === "PRD.md");
  const addDoc = (doc: DocumentItem) => setDocs((prev) => [...prev, doc]);

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
            {docs.map((doc) => (
              <DocumentCard
                key={`${slug}-${doc.title}`}
                slug={slug!}
                title={doc.title}
                content={doc.content}
                lastModified={doc.lastModified}
              />
            ))}
            {hasPrd && (
              <GenerateArchitectureCard
                slug={slug!}
                apiUrl={apiUrl}
                onGenerated={addDoc}
              />
            )}
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

const DocumentsSection = memo(DocumentsSectionComponent);

export default DocumentsSection;
