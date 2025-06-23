"use client";

interface ProjectOption {
  slug: string;
  name: string;
}

interface ProjectSelectorProps {
  projects: ProjectOption[];
  value: string;
  onChange: (slug: string) => void;
}

const ProjectSelector = ({ projects, value, onChange }: ProjectSelectorProps) => {

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
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a project...</option>
        {projects.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
      {value && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Selected project: {value}
        </p>
      )}
    </div>
  );
};

export default ProjectSelector;
