export function toSlug(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  }
  
  export function fromSlug(slug: string) {
    return slug.trim().replace(/-/g, " ");
  }
  