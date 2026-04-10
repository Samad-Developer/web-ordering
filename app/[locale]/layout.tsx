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
import { getDomainFromHeaders, fetchSEOData, createSEOMap } from "@/lib/seo/seo-utils";
import { AddressSelectionModal } from "@/components/address-modal/AddressSelectionModal";

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

// Generate Dynamic SEO Based On Domain 
export async function generateMetadata() {
  try {
    const domain = await getDomainFromHeaders();
    const seoData = await fetchSEOData(domain);
    const seoMap = createSEOMap(seoData?.generalSeo);

    const title = seoMap.WEBSITE_META_TITLE || seoMap.HOMEPAGE_META_TITLE;
    const description = seoMap.HOMEPAGE_META_DESCRIPTION;

    return {
      title,
      description,
      metadataBase: new URL(`https://${domain}`),

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
    return {
      title: "Your Restaurant Tab Title",
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
    <html lang={locale} dir={locale === 'ur' ? 'rtl' : 'ltr'}>
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
