"use client";

import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function Markdown({ source }: { source: string }) {
  const html = useMemo(() => {
    const raw = marked.parse(source, { async: false }) as string;
    if (typeof window === "undefined") return raw;
    return DOMPurify.sanitize(raw);
  }, [source]);

  return (
    <div
      className="prose-coach"
      // Sanitized via DOMPurify above. In mono-user context, attack surface = LLM output only.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
