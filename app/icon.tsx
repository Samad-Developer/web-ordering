
import { fetchSEOData, getDomainFromHeaders, extractLogoUrl } from '@/lib/seo/seo-utils';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';
export const runtime = 'edge';

export default async function Icon() {
  try {
    const domain = await getDomainFromHeaders();
    const seoData = await fetchSEOData(domain);
    const logoUrl = extractLogoUrl(seoData);
    
    if (!logoUrl) {
      return new Response(null, { status: 404 });
    }
    
    // Fetch the actual logo image
    const logoResponse = await fetch(logoUrl);
    
    if (!logoResponse.ok) {
      throw new Error(`Failed to fetch logo: ${logoResponse.status}`);
    }
    
    // Get image data as ArrayBuffer
    const imageBuffer = await logoResponse.arrayBuffer();

    // Get content type from logo response
    const imageContentType = logoResponse.headers.get('content-type') || contentType;
    
    // Return Response object (valid per official docs)
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': imageContentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
    
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}