"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

const downloadMarkdown = (content: string, filename: string = "PRD.md") => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  if (!content) return null;

  return (
    <div className="space-y-4">
      <section className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{content}</ReactMarkdown>
      </section>
      <button
        type="button"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() => downloadMarkdown(content)}
      >
        Download as .md file
      </button>
    </div>
  );
};

export default MarkdownPreview;
