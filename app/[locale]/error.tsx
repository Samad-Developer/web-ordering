"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // optional, replace if not using shadcn
import { RefreshCw, Home, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <UtensilsCrossed className="h-8 w-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Oops! Something went wrong
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm text-gray-600">
          We’re having trouble loading this page right now.
          Please try again or go back to the menu.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-4 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-400">
          If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
