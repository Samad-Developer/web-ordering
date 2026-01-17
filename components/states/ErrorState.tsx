"use client";

import { RefreshCw, Home, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong while loading the menu.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="w-full py-48 flex items-center justify-center  px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl p-8">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <UtensilsCrossed className="h-8 w-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Unable to load menu
        </h1>

        {/* Message */}
        <p className="mt-3 text-sm text-gray-600">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Please check your connection or try again shortly.
        </p>
      </div>
    </div>
  );
}
