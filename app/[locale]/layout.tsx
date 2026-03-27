import "../globals.css";
import React from "react";
import { Providers } from "./providers";
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from 'next-intl';
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { SearchProvider } from "@/contexts/SearchContext";
import { SignalRProvider } from "@/contexts/signalr-provider";
import { BranchStatus } from "@/components/shared/BranchStatus";
import { CartDrawer } from "@/components/shared/cart/CartDrawer";
import { ProductModal } from "@/components/menu/partials/product-modal/ProductModal";
import { AddressSelectionModal } from "@/components/address-modal/AddressSelectionModal";
import { headers } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type SEOItem = {
  id: number;
  name: string;
  value: string;
};

type SEOResponse = {
  generalSeo: SEOItem[];
};

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  const domain = host.includes("localhost")
    ? "pathan.eatx.pk"
    : host;

  try {
    const response = await fetch(
      `${API_BASE_URL}/seo?domain=${domain}`,
      {
        next: { revalidate: 3600 }, // cache 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch SEO");
    }

    const data: SEOResponse = await response.json();


    const seoMap = data.generalSeo?.reduce<Record<string, string>>((acc, item) => {
      if (item.value) {
        acc[item.name] = item.value;
      }
      return acc;
    }, {});

    const title =
      seoMap.HOMEPAGE_META_TITLE ||
      seoMap.WEBSITE_META_TITLE ||
      "Default Title";

    const description =
      seoMap.HOMEPAGE_META_DESCRIPTION ||
      "Default Description";

    return {
      title,
      description,
      metadataBase: new URL(`https://${domain}`),

      // 🔥 Optional but recommended
      openGraph: {
        title,
        description,
        url: `https://${domain}`,
        siteName: domain,
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("SEO Error:", error);

    // ✅ fallback (never break page)
    return {
      title: "Default Title",
      description: "Default Description",
    };
  }
}


export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ur' || locale === 'ur' ? 'rtl' : 'ltr'}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <SearchProvider>
              <SignalRProvider>
                <ThemeProvider>
                  <BranchStatus />
                  {children}
                  <Toaster position="top-center" richColors />
                  <AddressSelectionModal />
                  <ProductModal />
                  <CartDrawer />
                </ThemeProvider>
              </SignalRProvider>
            </SearchProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
