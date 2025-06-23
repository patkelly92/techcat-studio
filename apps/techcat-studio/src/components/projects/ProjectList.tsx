import Link from "next/link";
import type { ProjectMetadata } from "@/lib/saveProjectMetadata";

interface ProjectItem {
  slug: string;
  data: ProjectMetadata;
}

interface ProjectListProps {
  projects: ProjectItem[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  if (projects.length === 0) {
    return <p>No projects yet. Create one to get started.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(({ slug, data }) => (
        <Link
          key={slug}
          href={`/projects/${slug}`}
          className="block rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800"
        >
          <h2 className="text-lg font-semibold">{data.name}</h2>
          {data.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {data.description}
            </p>
          )}
          {data.tech_stack && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {data.tech_stack}
            </p>
          )}
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;
