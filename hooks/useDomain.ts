import { useEffect, useState } from "react";

export default function useDomain() {
  const [domain, setDomain] = useState<string | null>(null);
  
  useEffect(() => {
    setDomain(window.location.hostname);
    console.log("Current Domain:", domain);
  }, []);

  return domain;
}