"use client";

import { useState } from "react";
import ProjectSelector from "@/components/projects/ProjectSelector";
import ProjectMetadataForm, { ProjectMetadata } from "./ProjectMetadataForm";

interface ProjectItem {
  slug: string;
  name: string;
}

const GenerateSection = ({ projects }: { projects: ProjectItem[] }) => {
  const [projectSlug, setProjectSlug] = useState<string>("");
  const [metadata, setMetadata] = useState<ProjectMetadata>({
    overview: "",
    intendedUsers: "",
    techStack: "",
    successCriteria: "",
  });

  const isValid =
    projectSlug &&
    metadata.overview.trim() &&
    metadata.intendedUsers.trim() &&
    metadata.techStack.trim() &&
    metadata.successCriteria.trim();

  const handleGenerate = () => {
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

    console.log(payload);
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
        disabled={!isValid}
      >
        Generate Infrastructure Files
      </button>
    </div>
  );
};

export default GenerateSection;
