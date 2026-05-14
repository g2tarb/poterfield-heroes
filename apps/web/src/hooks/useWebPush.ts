"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Status = "unsupported" | "default" | "denied" | "granted" | "subscribed";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const formatted = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(formatted);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function useWebPush() {
  const [status, setStatus] = useState<Status>("default");
  const [vapidKey, setVapidKey] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as Status);

    void (async () => {
      try {
        const data = await apiFetch<{ publicKey: string | null }>(
          "/api/push/vapid-public",
        );
        if (data.publicKey) setVapidKey(data.publicKey);
      } catch {
        // ignore
      }

      // Already subscribed ?
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) setStatus("subscribed");
    })();
  }, []);

  const subscribe = useCallback(async () => {
    if (status === "unsupported" || !vapidKey) return null;

    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      setStatus(perm as Status);
      if (perm !== "granted") return null;
    }

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    const subJson = sub.toJSON() as {
      endpoint: string;
      keys: { p256dh: string; auth: string };
    };

    await apiFetch("/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify({
        endpoint: subJson.endpoint,
        keys: subJson.keys,
        userAgent: navigator.userAgent,
      }),
    });

    setStatus("subscribed");
    return sub;
  }, [status, vapidKey]);

  const unsubscribe = useCallback(async () => {
    if (typeof window === "undefined") return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    await apiFetch("/api/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
    await sub.unsubscribe();
    setStatus("default");
  }, []);

  return { status, vapidKey, subscribe, unsubscribe };
}
