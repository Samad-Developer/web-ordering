"use client";

import { useConfig } from "./useConfig";
import { useEffect, useState } from "react";

const STORAGE_KEY = "website_version";

export function useWebsiteVersionSync() {
    const settings = useConfig();
    const [isReady, setIsReady] = useState(false);

    const apiVersion = settings?.WEBSITE_VERSION || "0.0.1";

    useEffect(() => {
        if (!apiVersion) return;

        const localVersion = localStorage.getItem(STORAGE_KEY);

        // First time (no version stored)
        if (!localVersion) {
            localStorage.clear(); // Clear any old data just in case
            localStorage.setItem(STORAGE_KEY, apiVersion);
            return;
        }

        // Version mismatch → clear storage + update version
        if (localVersion !== apiVersion) {
            console.log("Version changed → clearing localStorage");

            localStorage.clear(); // ⚠️ clears everything
            localStorage.setItem(STORAGE_KEY, apiVersion);
        }

        setIsReady(true);
    }, [apiVersion]);

    return {
        isReady,
        version: apiVersion,
    };
}