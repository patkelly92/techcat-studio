"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface DocumentCardProps {
  title: string;
  content: string;
}

const DocumentCard = ({ title, content }: DocumentCardProps) => {
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
      <h2 className="text-lg font-medium">{title}</h2>
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
        <div className="prose max-w-none border-t pt-4 dark:prose-invert">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default DocumentCard;
