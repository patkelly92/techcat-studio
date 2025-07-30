"use client";

export interface ProjectMetadata {
  overview: string;
  intendedUsers: string;
  techStack: string;
  successCriteria: string;
}

interface ProjectMetadataFormProps {
  value: ProjectMetadata;
  onChange: (value: ProjectMetadata) => void;
}

const ProjectMetadataForm = ({ value, onChange }: ProjectMetadataFormProps) => {
  const { overview, intendedUsers, techStack, successCriteria } = value;

  const handleChange =
    (field: keyof ProjectMetadata) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="overview" className="font-medium">
          Project Overview
        </label>
        <textarea
          id="overview"
          className="rounded-md border px-3 py-2"
          value={overview}
          onChange={handleChange("overview")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="intendedUsers" className="font-medium">
          Intended Users
        </label>
        <textarea
          id="intendedUsers"
          className="rounded-md border px-3 py-2"
          value={intendedUsers}
          onChange={handleChange("intendedUsers")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="techStack" className="font-medium">
          Tech Stack
        </label>
        <textarea
          id="techStack"
          className="rounded-md border px-3 py-2"
          placeholder="e.g. Next.js, FastAPI, PostgreSQL"
          value={techStack}
          onChange={handleChange("techStack")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="successCriteria" className="font-medium">
          Success Criteria
        </label>
        <textarea
          id="successCriteria"
          className="rounded-md border px-3 py-2"
          value={successCriteria}
          onChange={handleChange("successCriteria")}
        />
      </div>
      <pre className="rounded-md bg-gray-100 p-3 text-sm dark:bg-zinc-800">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  );
};

export default ProjectMetadataForm;
