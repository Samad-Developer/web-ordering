import { headers } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type SEOItem = {
    id: number;
    name: string;
    value: string;
};

type SEOResponse = {
    generalSeo: SEOItem[];
};


/**
 * Extracts domain from Next.js request headers
 */
export async function getDomainFromHeaders(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const domain = host.includes("localhost") ? "maishafoods.pk" : host;

    return domain;
}


/**
 * Fetches SEO data from your API based on domain
 */
export async function fetchSEOData(domain: string): Promise<SEOResponse | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/seo?domain=${domain}`, {
            next: { 
                revalidate: 3600,
                tags: ['seo-data', `seo-${domain}`]
             },
            
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('[SEO] Error fetching SEO data:', error);
        return null;
    }
}


export function createSEOMap(seoItems: SEOItem[] = []) {
  return seoItems.reduce<Record<string, string>>((acc, item) => {
    if (item.value) {
      acc[item.name] = item.value;
    }
    return acc;
  }, {});
}


export function extractLogoUrl(seoData: any): string | null {
  const seoArray = seoData?.generalSeo;

  if (!Array.isArray(seoArray)) return null;

  const logoItem = seoArray.find(
    (item: any) => item.name === "UPLOAD_LOGO"
  );

  return `${process.env.NEXT_PUBLIC_API_URL}/${logoItem?.value}` || null;
}
