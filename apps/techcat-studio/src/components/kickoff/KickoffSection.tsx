"use client";

import { useState } from "react";
import ProjectSelector from "@/components/projects/ProjectSelector";
import KickoffForm, { GenerateFormData } from "./KickoffForm";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

interface ProjectItem {
  slug: string;
  name: string;
}

interface KickoffSectionProps {
  projects: ProjectItem[];
  apiUrl: string;
}

const KickoffSection = ({ projects, apiUrl }: KickoffSectionProps) => {
  const [projectSlug, setProjectSlug] = useState<string>("");
  const [formData, setFormData] = useState<GenerateFormData>({
    productOverview: "",
    targetUsers: "",
    userPainPoints: "",
    coreFeatures: "",
    techStack: "",
    constraints: "",
    stretchGoals: "",
    tone: "",
  });
  const [success, setSuccess] = useState(false);

  const isValid =
    projectSlug && formData.productOverview.trim() && formData.techStack.trim();

  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const handleGenerate = async () => {
    const payload = {
      projectSlug,
      productOverview: formData.productOverview.trim(),
      targetUsers: formData.targetUsers.trim(),
      userPainPoints: formData.userPainPoints.trim(),
      coreFeatures: formData.coreFeatures.trim(),
      techStack: formData.techStack
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
      constraints: formData.constraints.trim(),
      stretchGoals: formData.stretchGoals.trim(),
      tone: formData.tone.trim(),
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
        setSuccess(true);
      }
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setSuccess(false);
    }
  };

  return (
    <div className="space-y-4">
      <ProjectSelector
        projects={projects}
        value={projectSlug}
        onChange={setProjectSlug}
      />
      <KickoffForm value={formData} onChange={setFormData} />
      <button
        type="button"
        className="
    inline-block rounded-md
    bg-gradient-to-b from-violet-500 to-violet-950
    px-4 py-2 text-sm font-medium text-white
    transition-colors duration-200
    hover:from-violet-400 hover:to-violet-800
  "
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
      {status === "success" && success && (
        <p className="text-sm text-green-600" role="status">
          ✅ PRD.md has been generated and saved for this project.
        </p>
      )}
    </div>
  );
};

export default KickoffSection;
