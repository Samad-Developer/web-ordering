"use client";

import { useEffect } from "react";

export default function SWCleaner() {
  useEffect(() => {
    async function cleanOldPWAs() {
      if (!("serviceWorker" in navigator)) return;

      try {
        const registrations =
          await navigator.serviceWorker.getRegistrations();

        // ✅ No SW → nothing to do
        if (!registrations.length) return;

        // ✅ prevent repeat cleaning (30 days lock)
        const lastClean = localStorage.getItem("sw_cleaned_at");
        const now = Date.now();

        if (lastClean && now - Number(lastClean) < 30 * 24 * 60 * 60 * 1000) {
          return;
        }

        console.log("Old Service Worker detected → cleaning");

        // unregister all SW
        for (const reg of registrations) {
          await reg.unregister();
        }

        // delete caches
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }

        // remember cleanup
        localStorage.setItem("sw_cleaned_at", String(now));

        // reload ONCE only if page was controlled
        if (navigator.serviceWorker.controller) {
          window.location.reload();
        }
      } catch (e) {
        console.log("SW cleanup error:", e);
      }
    }

    cleanOldPWAs();
  }, []);

  return null;
}