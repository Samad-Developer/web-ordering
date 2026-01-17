"use client";

import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";

export default function LoadingState() {
    const t = useTranslations("common")

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-2xl max-w-sm mx-4">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent" />
            <div>
              <p className="text-gray-900 font-semibold text-lg">
                Loading Menu
              </p>
              <p className="text-gray-500 text-sm">
                Fetching items for your location...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
}
