"use client";

export interface ProjectMetadata {
  productOverview: string;
  targetUsers: string;
  techStack: string;
  successCriteria: string;
}

interface ProjectMetadataFormProps {
  value: ProjectMetadata;
  onChange: (value: ProjectMetadata) => void;
}

const ProjectMetadataForm = ({ value, onChange }: ProjectMetadataFormProps) => {
  const { productOverview, targetUsers, techStack, successCriteria } = value;

  const handleChange =
    (field: keyof ProjectMetadata) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="productOverview" className="font-medium">
          Product Overview
        </label>
        <textarea
          id="productOverview"
          className="rounded-md border px-3 py-2"
          value={productOverview}
          onChange={handleChange("productOverview")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="targetUsers" className="font-medium">
          Target Users
        </label>
        <textarea
          id="targetUsers"
          className="rounded-md border px-3 py-2"
          value={targetUsers}
          onChange={handleChange("targetUsers")}
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
    </div>
  );
};

export default ProjectMetadataForm;
