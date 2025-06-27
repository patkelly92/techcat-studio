"use client";

import { useState, useRef, useEffect } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

interface DocumentItem {
  title: string;
  content: string;
  lastModified: string;
}

interface GenerateArchitectureCardProps {
  slug: string;
  apiUrl: string;
  onGenerated: (doc: DocumentItem) => void;
}

const GenerateArchitectureCard = ({
  slug,
  apiUrl,
  onGenerated,
}: GenerateArchitectureCardProps) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") {
      cardRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [status]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setStatus("loading");
      setErrorMsg(null);
      const resp = await fetch(`${apiUrl}/api/generate/architecture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: slug }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.detail || data?.error || "Request failed");
      }
      if (!data["ARCHITECTURE.md"]) {
        throw new Error("No file returned");
      }
      onGenerated({
        title: "ARCHITECTURE.md",
        content: data["ARCHITECTURE.md"],
        lastModified: new Date().toISOString(),
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  };

  return (
    <div ref={cardRef} className="space-y-2 rounded-md border p-4">
      <h2 className="text-lg font-medium">Generate ARCHITECTURE.md</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        This file will be generated using your PRD as input.
      </p>
      <button
        type="button"
        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Generating..." : "Generate Architecture File"}
      </button>
      {status === "loading" && <LoadingIndicator />}
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          {errorMsg || "Failed to generate ARCHITECTURE.md."}
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-600" role="status">
          ✅ ARCHITECTURE.md generated and saved.
        </p>
      )}
    </div>
  );
};

export default GenerateArchitectureCard;
