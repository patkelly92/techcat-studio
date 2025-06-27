"use client";

import { memo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProjectSelector from "@/components/projects/ProjectSelector";
import DocumentCard from "./DocumentCard";
import GenerateArchitectureButton from "./GenerateArchitectureButton";
import GenerateAgentsCard from "./GenerateAgentsCard";

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
  refreshDocuments: () => void;
}

const DocumentsSectionComponent = ({
  projects,
  slug,
  documents,
  apiUrl,
  refreshDocuments,
}: DocumentsSectionProps) => {
  const router = useRouter();
  const docs = documents;

  const handleChange = useCallback(
    (value: string) => {
      const query = value ? `?slug=${encodeURIComponent(value)}` : "";
      router.push(`/documents${query}`);
    },
    [router],
  );

  const isEmpty = slug ? docs.length === 0 : true;
  const hasPrd = docs.some((d) => d.title === "PRD.md");
  const hasArch = docs.some((d) => d.title === "ARCHITECTURE.md");
  const hasAgents = docs.some((d) => d.title === "AGENTS.md");

  useEffect(() => {
    if (docs.length) {
      console.log(
        "Loaded documents",
        docs.map((d) => d.title),
      );
    }
  }, [docs]);

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
            {hasPrd && !hasArch && (
              <GenerateArchitectureButton
                slug={slug!}
                apiUrl={apiUrl}
                onSuccess={refreshDocuments}
              />
            )}
            {hasPrd && hasArch && !hasAgents && (
              <GenerateAgentsCard
                slug={slug!}
                apiUrl={apiUrl}
                onSuccess={refreshDocuments}
              />
            )}
            {hasPrd && hasArch && !hasAgents && (
              <p className="text-sm text-yellow-600" role="status">
                AGENTS.md not found after generation.
              </p>
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
