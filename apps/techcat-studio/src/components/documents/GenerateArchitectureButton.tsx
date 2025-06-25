"use client";

import { useState, useEffect } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

interface GenerateArchitectureButtonProps {
  slug: string;
  apiUrl: string;
  onSuccess: () => void;
}

const GenerateArchitectureButton = ({ slug, apiUrl, onSuccess }: GenerateArchitectureButtonProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "success") {
      timer = setTimeout(() => setStatus("idle"), 3000);
    }
    return () => clearTimeout(timer);
  }, [status]);

  const handleClick = async () => {
    try {
      setStatus("loading");
      const resp = await fetch(`${apiUrl}/generate/architecture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: slug }),
      });
      if (!resp.ok) {
        throw new Error("Request failed");
      }
      setStatus("success");
      onSuccess();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={handleClick}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Generating..." : "Generate ARCHITECTURE.md"}
      </button>
      {status === "loading" && <LoadingIndicator />}
      {status === "error" && (
        <p className="text-sm text-red-600" role="alert">
          Failed to generate ARCHITECTURE.md.
        </p>
      )}
      {status === "success" && (
        <div
          className="fixed right-4 top-4 rounded-md bg-green-600 px-3 py-2 text-white shadow"
          role="status"
        >
          ARCHITECTURE.md created successfully!
        </div>
      )}
    </div>
  );
};

export default GenerateArchitectureButton;

