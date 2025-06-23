"use client";

import { useState } from "react";

interface ProjectOption {
  slug: string;
  name: string;
}

interface ProjectSelectorProps {
  projects: ProjectOption[];
}

const ProjectSelector = ({ projects }: ProjectSelectorProps) => {
  const [selected, setSelected] = useState<string>("");

  if (projects.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No projects found. Create a project before generating files.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="project" className="font-medium">
        Project
      </label>
      <select
        id="project"
        className="rounded-md border px-3 py-2"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select a project...</option>
        {projects.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      {selected && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selected project: {selected}
        </p>
      )}
    </div>
  );
};

export default ProjectSelector;
