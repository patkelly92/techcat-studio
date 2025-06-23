import type { ProjectMetadata } from "@/lib/saveProjectMetadata";

interface ProjectDetailProps {
  project: ProjectMetadata;
}

const ProjectDetail = ({ project }: ProjectDetailProps) => {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      {project.description && <p>{project.description}</p>}
      {project.tech_stack && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {project.tech_stack}
        </p>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Created {new Date(project.created_at).toLocaleString()}
      </p>
    </div>
  );
};

export default ProjectDetail;
