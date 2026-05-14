"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";

type Props = {
  value: string;
  onChange: (value: string) => void;
  language?: "javascript" | "typescript" | "python";
  readonly?: boolean;
};

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readonly = false,
}: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const isTs = language === "typescript";
    const isPy = language === "python";
    const langExtension = isPy
      ? python()
      : javascript({ jsx: false, typescript: isTs });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        history(),
        indentOnInput(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        highlightActiveLine(),
        keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
        langExtension,
        oneDark,
        EditorView.lineWrapping,
        EditorView.editable.of(!readonly),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChange(u.state.doc.toString());
        }),
        EditorView.theme({
          "&": { fontSize: "13px", height: "100%" },
          ".cm-content": { fontFamily: "var(--font-mono)" },
          ".cm-gutters": {
            background: "var(--color-bg-base)",
            border: "0",
            color: "var(--color-fg-muted)",
          },
          "&.cm-focused .cm-cursor": {
            borderLeftColor: "var(--color-accent)",
          },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Intentionally re-init on language change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, readonly]);

  // Sync external value updates (e.g., reset to starter code)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    if (view.state.doc.toString() !== value) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  }, [value]);

  return (
    <div
      ref={hostRef}
      className="h-full overflow-hidden rounded-md border border-[var(--color-border-subtle)]"
    />
  );
}
