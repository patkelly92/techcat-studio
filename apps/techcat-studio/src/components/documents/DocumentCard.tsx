"use client";

import { memo, useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const Markdown = dynamic(() => import("react-markdown"), { ssr: false });
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface DocumentCardProps {
  slug: string;
  title: string;
  content: string;
  lastModified?: string;
}

const DocumentCardComponent = ({
  slug,
  title,
  content,
  lastModified,
}: DocumentCardProps) => {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const [draft, setDraft] = useState(content);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const markdownPreview = useMemo(
    () => (
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {currentContent}
      </Markdown>
    ),
    [currentContent],
  );

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }, [currentContent]);

  const downloadFile = useCallback(() => {
    const blob = new Blob([currentContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = title;
    link.click();
    URL.revokeObjectURL(url);
  }, [currentContent, title]);

  const handleEdit = useCallback(() => {
    setDraft(currentContent);
    setEditing(true);
    setShow(false);
  }, [currentContent]);

  const handleCancel = useCallback(() => {
    setDraft(currentContent);
    setEditing(false);
    setShow(true);
  }, [currentContent]);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);
      setMessage(null);
      const resp = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: title, content: draft }),
      });
      if (!resp.ok) {
        throw new Error("Failed to save document");
      }
      setCurrentContent(draft);
      setEditing(false);
      setShow(true);
      setMessage("Changes saved");
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }, [slug, title, draft]);

  return (
    <div className="space-y-2 rounded-md border p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-medium">{title}</h2>
        {lastModified && (
          <span className="text-xs text-gray-500">
            {new Date(lastModified).toLocaleString()}
          </span>
        )}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setShow((s) => !s)}
        >
          {show ? "Hide" : "Preview"}
        </button>
        <button
          type="button"
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          type="button"
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={copyToClipboard}
        >
          Copy
        </button>
        <button
          type="button"
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={downloadFile}
        >
          Download
        </button>
      </div>
      {message && (
        <p className="text-sm text-green-600" role="status">
          {message}
        </p>
      )}
      {editing ? (
        <div className="space-y-2 border-t pt-4">
          <textarea
            className="w-full rounded-md border p-2 font-mono text-sm"
            rows={10}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              onClick={handleSave}
              disabled={saving || draft === currentContent}
            >
              Save
            </button>
            <button
              type="button"
              className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleCancel}
            >
              Cancel
            </button>
            {saving && <LoadingIndicator />}
          </div>
        </div>
      ) : (
        show && (
          <div className="prose max-w-none border-t pt-4 dark:prose-invert max-h-96 overflow-y-auto">
            {markdownPreview}
          </div>
        )
      )}
    </div>
  );
};

const DocumentCard = memo(DocumentCardComponent);

export default DocumentCard;
