"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface DocumentCardProps {
  title: string;
  content: string;
  lastModified?: string;
}

const DocumentCard = ({ title, content, lastModified }: DocumentCardProps) => {
  const [show, setShow] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const downloadFile = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = title;
    link.click();
    URL.revokeObjectURL(url);
  };

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
      {show && (
        <div className="prose max-w-none border-t pt-4 dark:prose-invert max-h-96 overflow-y-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
