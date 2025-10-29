"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RestaurantAboutProps {
  title: string;
  description: string;
}

export const RestaurantAbout: React.FC<RestaurantAboutProps> = ({
  title,
  description,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const paragraphs = description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const displayParagraphs = isExpanded ? paragraphs : [paragraphs[0]];
  const hasMoreContent = paragraphs.length > 1;

  return (
    <div className="space-y-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      <div className="space-y-3">
        {displayParagraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {hasMoreContent && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Read Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Read More <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 max-w-3xl mx-auto mt-6 pt-4"></div>
    </div>
  );
};
