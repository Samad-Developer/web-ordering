import { useEffect, useState } from "react";

export default function useDomain() {
  const [domain, setDomain] = useState<string | null>(null);
  console.log("Current Domain:", domain);

  useEffect(() => {
    setDomain(window.location.hostname);
  }, []);

  return domain;
}