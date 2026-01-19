const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Validates if image path is valid
 */
export function isValidImagePath(imagePath: unknown): boolean {
  return (
    typeof imagePath === 'string' &&
    imagePath.trim() !== '' &&
    imagePath !== 'N/A' &&
    imagePath !== 'null' &&
    imagePath !== 'undefined'
  );
}

/**
 * Get full image URL with fallback
 */
export function getImageUrl(
  imagePath: string | null | undefined,
  fallbackPath: string
): string {
  if (!isValidImagePath(imagePath)) {
    return fallbackPath;
  }

  // If already a full URL, return as-is
  if (imagePath!.startsWith('http://') || imagePath!.startsWith('https://')) {
    return imagePath!;
  }

  // Ensure path starts with /
  const normalizedPath = imagePath!.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${API_BASE_URL}${normalizedPath}`;
}