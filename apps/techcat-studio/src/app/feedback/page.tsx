"use client";

import { useEffect, useState, useCallback } from "react";

interface FeedbackItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
}

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
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [sortDesc, setSortDesc] = useState(true);

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

  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/feedback`);
      if (!res.ok) throw new Error("Failed to load feedback");
      const data = (await res.json()) as FeedbackItem[];
      setFeedback(data);
    } catch (err) {
      console.error(err);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

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
      fetchFeedback();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const displayed = feedback
    .filter((f) => (filterType ? f.type === filterType : true))
    .sort((a, b) => {
      const t1 = new Date(a.created_at).getTime();
      const t2 = new Date(b.created_at).getTime();
      return sortDesc ? t2 - t1 : t1 - t2;
    });

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
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>
      </form>
      <div className="space-y-2 mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="filter" className="font-medium">
            Filter:
          </label>
          <select
            id="filter"
            className="rounded-md border px-2 py-1"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All</option>
            {feedbackTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">Type</th>
              <th className="px-2 py-1 text-left">Message</th>
              <th
                className="px-2 py-1 text-left cursor-pointer"
                onClick={() => setSortDesc(!sortDesc)}
              >
                Date {sortDesc ? "▼" : "▲"}
              </th>
              <th className="px-2 py-1" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayed.map((f) => (
              <tr key={f.id}>
                <td className="px-2 py-1 align-top text-sm font-medium">
                  {f.type}
                </td>
                <td className="px-2 py-1 align-top text-sm whitespace-pre-wrap">
                  {f.message}
                </td>
                <td className="px-2 py-1 align-top text-sm">
                  {new Date(f.created_at).toLocaleString()}
                </td>
                <td className="px-2 py-1 align-top text-sm">
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                    onClick={() => {}}
                  >
                    Process
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
