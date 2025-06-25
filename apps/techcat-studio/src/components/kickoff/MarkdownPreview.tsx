"use client";

import { memo, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";

const Markdown = dynamic(() => import("react-markdown"), { ssr: false });

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

const MarkdownPreviewComponent = ({ content }: MarkdownPreviewProps) => {
  const rendered = useMemo(
    () => <Markdown>{content}</Markdown>,
    [content],
  );
  const handleDownload = useCallback(
    () => downloadMarkdown(content),
    [content],
  );

  if (!content) return null;

  return (
    <div className="space-y-4">
      <section className="prose max-w-none dark:prose-invert">{rendered}</section>
      <button
        type="button"
        className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        onClick={handleDownload}
      >
        Download as .md file
      </button>
    </div>
  );
};

const MarkdownPreview = memo(MarkdownPreviewComponent);

export default MarkdownPreview;
