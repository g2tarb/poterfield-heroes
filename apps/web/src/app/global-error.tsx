"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[porterfield] global error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          background: "#0A0A0B",
          color: "#E6E6E6",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            fatal
          </p>
          <p
            style={{
              marginTop: 12,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              opacity: 0.6,
            }}
          >
            // l'app a planté complètement
          </p>
          <pre
            style={{
              marginTop: 20,
              padding: 12,
              border: "1px solid #2a2a2d",
              background: "#141416",
              fontSize: 11,
              textAlign: "left",
              overflow: "auto",
              maxHeight: 160,
            }}
          >
            {error.message}
            {error.digest ? `\n\ndigest: ${error.digest}` : ""}
          </pre>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              minHeight: 40,
              padding: "0 16px",
              border: "2px solid #FFB347",
              color: "#FFB347",
              background: "transparent",
              fontFamily: "inherit",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              cursor: "pointer",
            }}
          >
            ↻ reload
          </button>
        </div>
      </body>
    </html>
  );
}
