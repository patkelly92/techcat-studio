"use client";

import { useState } from "react";
import ProjectSelector from "@/components/projects/ProjectSelector";
import ProjectMetadataForm, { ProjectMetadata } from "./ProjectMetadataForm";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import MarkdownPreview from "./MarkdownPreview";

interface ProjectItem {
  slug: string;
  name: string;
}

interface GenerateSectionProps {
  projects: ProjectItem[];
  apiUrl: string;
}

const GenerateSection = ({ projects, apiUrl }: GenerateSectionProps) => {
  const [projectSlug, setProjectSlug] = useState<string>("");
  const [metadata, setMetadata] = useState<ProjectMetadata>({
    overview: "",
    intendedUsers: "",
    techStack: "",
    successCriteria: "",
  });
  const [markdownOutput, setMarkdownOutput] = useState<string>("");

  const isValid =
    projectSlug &&
    metadata.overview.trim() &&
    metadata.intendedUsers.trim() &&
    metadata.techStack.trim() &&
    metadata.successCriteria.trim();

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleGenerate = async () => {
    const payload = {
      projectSlug,
      overview: metadata.overview.trim(),
      intendedUsers: metadata.intendedUsers.trim(),
      techStack: metadata.techStack
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      successCriteria: metadata.successCriteria.trim(),
    };

    try {
      setStatus("loading");
      const response = await fetch(`${apiUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = await response.json();
      if (data["PRD.md"]) {
        setMarkdownOutput(data["PRD.md"] as string);
      }
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMarkdownOutput("");
    }
  };

  return (
    <div className="space-y-4">
      <ProjectSelector
        projects={projects}
        value={projectSlug}
        onChange={setProjectSlug}
      />
      <ProjectMetadataForm value={metadata} onChange={setMetadata} />
      <button
        type="button"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={!isValid || status === "loading"}
      >
        {status === "loading"
          ? "Generating..."
          : "Generate Infrastructure Files"}
      </button>
      {status === "loading" && <LoadingIndicator />}
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          Failed to generate files. Please try again.
        </p>
      )}
      {markdownOutput && <MarkdownPreview content={markdownOutput} />}
    </div>
  );
};

export default GenerateSection;
