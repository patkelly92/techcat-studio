"use client";

import { useState, useRef, useEffect } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

interface GenerateAgentsCardProps {
  slug: string;
  apiUrl: string;
  onSuccess: () => void;
}

const GenerateAgentsCard = ({
  slug,
  apiUrl,
  onSuccess,
}: GenerateAgentsCardProps) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const cardRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (status === "success") {
      cardRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [status]);

  const handleGenerate = async () => {
    try {
      setStatus("loading");
      setErrorMsg(null);
      const resp = await fetch(`${apiUrl}/api/generate/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.detail || data?.error || "Request failed");
      }
      if (!data?.filename) {
        throw new Error("No file returned");
      }
      setStatus("success");
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  };

  return (
    <div ref={cardRef} className="space-y-2 rounded-md border p-4">
      <h2 className="text-lg font-medium">Generate AGENTS.md</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        This file will be generated using your PRD and ARCHITECTURE files.
      </p>
      <button
        type="button"
        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Generating..." : "Generate Agents File"}
      </button>
      {status === "loading" && <LoadingIndicator />}
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {errorMsg || "Failed to generate AGENTS.md."}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-600" role="status">
          ✅ AGENTS.md generated and saved.
        </p>
      )}
    </div>
  );
};

export default GenerateAgentsCard;
