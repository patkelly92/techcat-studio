"use client";

import { useEffect, useState } from "react";

interface ProjectItem {
  id: string;
  name: string;
}

const feedbackTypes = ["Bug", "Suggestion", "Feedback", "Other"] as const;
const MAX_LENGTH = 1000;

type FeedbackType = (typeof feedbackTypes)[number];

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [type, setType] = useState<FeedbackType>("Bug");
  const [message, setMessage] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/projects`, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { id: string; name: string }[];
        setProjects(data.map((p) => ({ id: p.id, name: p.name })));
      } catch {
        // ignore
      }
    };
    fetchProjects();
  }, [apiUrl]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!message.trim()) {
      setError("Message is required");
      return;
    }
    if (message.trim().length > MAX_LENGTH) {
      setError(`Message must be ${MAX_LENGTH} characters or less`);
      return;
    }
    try {
      setStatus("loading");
      const resp = await fetch(`${apiUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message,
          project_id: projectId || null,
        }),
      });
      if (!resp.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage("");
      setProjectId("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">💬 Feedback</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="flex flex-col gap-1">
          <label htmlFor="type" className="font-medium">
            Type
          </label>
          <select
            id="type"
            className="rounded-md border px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value as FeedbackType)}
          >
            {feedbackTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        {projects.length > 0 && (
          <div className="flex flex-col gap-1">
            <label htmlFor="project" className="font-medium">
              Project (Optional)
            </label>
            <select
              id="project"
              className="rounded-md border px-3 py-2"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">None</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="font-medium">
            Message
          </label>
          <textarea
            id="message"
            className="rounded-md border px-3 py-2"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
            rows={4}
            maxLength={MAX_LENGTH}
            placeholder="What’s on your mind? Tell us what’s broken, brilliant, or baffling — in 1000 characters or less."
            required
          />
          <p className={`text-sm ${message.length >= MAX_LENGTH ? "text-red-600" : "text-gray-600"}`}>{message.length}/{MAX_LENGTH}</p>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {status === "success" && (
          <p className="text-sm text-green-600">Feedback submitted!</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600">Failed to submit feedback.</p>
        )}
        <button
          type="submit"
          className="
    inline-flex items-center justify-center
    rounded-md
    bg-gradient-to-b from-violet-500 to-violet-950
    px-4 py-2 text-sm font-medium text-white
    transition-colors duration-200
    hover:from-violet-400 hover:to-violet-800
    disabled:opacity-50
  "
          disabled={status === "loading"}
        >
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
