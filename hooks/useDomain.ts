export default function useDomain() {
  if (typeof window === "undefined") return null;
  const domainName = window.location.hostname;
  console.log("Domain Name:", domainName);
  return domainName;
}