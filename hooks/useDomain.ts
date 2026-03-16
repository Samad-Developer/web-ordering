"use client";

import { useEffect, useState } from "react";

export default function useDomain() {
  const [domain, setDomain] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDomain(window.location.hostname);
    }
  }, []);

  return domain;
}