"use client";

import { useCallback, useEffect, useState } from "react";

interface FeedbackItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
}

const feedbackTypes = ["Bug", "Suggestion", "Feedback", "Other"] as const;

export default function Page() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [sortDesc, setSortDesc] = useState(true);

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

  const displayed = feedback
    .filter((f) => (filterType ? f.type === filterType : true))
    .sort((a, b) => {
      const t1 = new Date(a.created_at).getTime();
      const t2 = new Date(b.created_at).getTime();
      return sortDesc ? t2 - t1 : t1 - t2;
    });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin</h1>
      <div className="space-y-2">
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
