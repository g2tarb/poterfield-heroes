"use client";

import { useCallback, useRef, useState } from "react";

export type CoachMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type StreamArgs = {
  message: string;
  moduleId?: string;
};

export function useCoachStream(initialSessionId?: string) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(
    initialSessionId ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async ({ message, moduleId }: StreamArgs) => {
      if (streaming) return;
      setError(null);

      const userMsgId = `u-${Date.now()}`;
      const assistantMsgId = `a-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        { id: userMsgId, role: "user", content: message },
        { id: assistantMsgId, role: "assistant", content: "" },
      ]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/coach/stream", {
          method: "POST",
          credentials: "include",
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            ...(moduleId ? { moduleId } : {}),
            ...(sessionId ? { sessionId } : {}),
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let separator: number;
          while ((separator = buffer.indexOf("\n\n")) !== -1) {
            const rawEvent = buffer.slice(0, separator);
            buffer = buffer.slice(separator + 2);
            const lines = rawEvent.split("\n");
            const eventLine = lines.find((l) => l.startsWith("event: "));
            const dataLine = lines.find((l) => l.startsWith("data: "));
            if (!eventLine || !dataLine) continue;
            const eventName = eventLine.slice(7).trim();
            let payload: unknown;
            try {
              payload = JSON.parse(dataLine.slice(6));
            } catch {
              continue;
            }

            if (eventName === "session" && typeof payload === "object" && payload && "sessionId" in payload) {
              setSessionId((payload as { sessionId: string }).sessionId);
            } else if (eventName === "chunk" && typeof payload === "object" && payload && "text" in payload) {
              const text = (payload as { text: string }).text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + text }
                    : m,
                ),
              );
            } else if (eventName === "error" && typeof payload === "object" && payload && "message" in payload) {
              setError((payload as { message: string }).message);
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [streaming, sessionId],
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { messages, streaming, sessionId, error, send, stop, setMessages };
}
