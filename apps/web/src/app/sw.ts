/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST: (string | { url: string; revision: string | null })[];
  }
}

declare const self: ServiceWorkerGlobalScope & WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

serwist.addEventListeners();

// === Web Push handler ===
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  let payload: {
    title: string;
    body?: string;
    url?: string;
    tag?: string;
    icon?: string;
  };
  try {
    payload = event.data.json();
  } catch {
    payload = { title: event.data.text() };
  }

  const promise = self.registration.showNotification(payload.title, {
    body: payload.body ?? "",
    icon: payload.icon ?? "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: payload.tag,
    data: { url: payload.url ?? "/" },
  });

  event.waitUntil(promise);
});

// === Click on notification → open the URL ===
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      for (const c of clients) {
        if (c.url.includes(url) && "focus" in c) {
          return (c as WindowClient).focus();
        }
      }
      return self.clients.openWindow(url);
    }),
  );
});
