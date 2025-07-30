"use client";

import ReactMarkdown from "react-markdown";

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
  if (!content) return null;

  return (
    <div className="prose max-w-none dark:prose-invert">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
