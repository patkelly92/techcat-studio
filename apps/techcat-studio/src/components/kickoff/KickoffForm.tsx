"use client";

export interface GenerateFormData {
  productOverview: string;
  targetUsers: string;
  userPainPoints: string;
  coreFeatures: string;
  techStack: string;
  constraints: string;
  stretchGoals: string;
  tone: string;
}

interface KickoffFormProps {
  value: GenerateFormData;
  onChange: (value: GenerateFormData) => void;
}

const KickoffForm = ({ value, onChange }: KickoffFormProps) => {
  const {
    productOverview,
    targetUsers,
    userPainPoints,
    coreFeatures,
    techStack,
    constraints,
    stretchGoals,
    tone,
  } = value;

  const handleChange =
    (field: keyof GenerateFormData) =>
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
          placeholder="What are you building and why?"
          className="rounded-md border px-3 py-2"
          value={productOverview}
          onChange={handleChange("productOverview")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="targetUsers" className="font-medium">
          Target Users{" "}
          <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <input
          id="targetUsers"
          type="text"
          placeholder="Who are you building this for?"
          className="rounded-md border px-3 py-2"
          value={targetUsers}
          onChange={handleChange("targetUsers")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="userPainPoints" className="font-medium">
          Top 3 User Pain Points{" "}
          <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea
          id="userPainPoints"
          placeholder="What problems or friction are your users facing?"
          className="rounded-md border px-3 py-2"
          value={userPainPoints}
          onChange={handleChange("userPainPoints")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="coreFeatures" className="font-medium">
          Core Features{" "}
          <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea
          id="coreFeatures"
          placeholder="What should this app be able to do? (e.g. Generate docs, summarize text...)"
          className="rounded-md border px-3 py-2"
          value={coreFeatures}
          onChange={handleChange("coreFeatures")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="techStack" className="font-medium">
          Tech Stack
        </label>
        <input
          id="techStack"
          type="text"
          placeholder="What technologies are you planning to use? (e.g. Next.js, GPT-4o, Postgres)"
          className="rounded-md border px-3 py-2"
          value={techStack}
          onChange={handleChange("techStack")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="constraints" className="font-medium">
          Constraints{" "}
          <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <input
          id="constraints"
          type="text"
          placeholder="Are there any limitations or non-negotiables?"
          className="rounded-md border px-3 py-2"
          value={constraints}
          onChange={handleChange("constraints")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="stretchGoals" className="font-medium">
          Stretch Goals{" "}
          <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <input
          id="stretchGoals"
          type="text"
          placeholder="What do you hope to add in the future?"
          className="rounded-md border px-3 py-2"
          value={stretchGoals}
          onChange={handleChange("stretchGoals")}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="tone" className="font-medium">
          Tone / Branding Personality{" "}
          <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <input
          id="tone"
          type="text"
          placeholder="Describe your project's voice or tone (e.g. Playful, Serious, Corporate)"
          className="rounded-md border px-3 py-2"
          value={tone}
          onChange={handleChange("tone")}
        />
      </div>
    </div>
  );
};

export default KickoffForm;
