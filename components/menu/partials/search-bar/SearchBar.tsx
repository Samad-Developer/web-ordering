"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useMenu } from "@/hooks/useMenu";
import { useSearch } from "@/contexts/SearchContext";
import { SvgIcon } from "@/components/common/SvgIcon";
import { extractCategoryNames } from "@/lib/search-bar/utils";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { useDebouncedCallback } from 'use-debounce';

const placeHolderCategoryNames = [
  "Burgers",
  "Pizza",
  "Drinks",
  "Desserts",
  "Fries",
];

const AnimatedSearch = () => {
  const { menuData } = useMenu();
  const { setSearchQuery } = useSearch();

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const categoryNames = extractCategoryNames(menuData || []).slice(0, 5) || placeHolderCategoryNames;
  const animatedText = useTypingAnimation(categoryNames, 80, 40, 1500);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
  }, 400);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    debouncedSearch.cancel();
  };


  return (
    <div className="relative max-w-3xl mx-auto my-2 sm:my-5 px-4">
      <div className="relative group">
        {/* Search Icon */}
        <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <SvgIcon
            src="/assets/images/svgIcons/search.svg"
            alt="search-icon"
            size={26}
          />
        </div>

        {/* Input */}
        <div className="relative">
          <Input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            className="w-full h-11 sm:h-14 pl-12 sm:pl-16 pr-14 text-base text-slate-800 placeholder-slate-400 rounded-full bg-white
                        border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                        transition-all duration-300 ease-out outline-none
                      hover:border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/25"
          />

          {/* Animated Placeholder */}
          {!inputValue && !isFocused && (
            <div className="absolute left-12 sm:left-16 top-1/2 -translate-y-1/2 pointer-events-none select-none">
              <span className="text-slate-500 text-base">
                Search for {animatedText}
                <span className="inline-block w-0.5 h-5 bg-slate-500 ml-1 animate-pulse align-middle" />
              </span>
            </div>
          )}
        </div>

        {/* Clear Button */}
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-5 sm:right-5 top-1/2 -translate-y-1/2 w-7 h-7 sm:h-9 sm:w-9 flex 
              items-center justify-center rounded-md bg-slate-50 cursor-pointer
              hover:bg-slate-100 transition-all duration-200 
              hover:scale-105 active:scale-95 group/clear z-10"
            aria-label="Clear search"
          >
            <X
              className="h-5 w-5 text-slate-500 group-hover/clear:text-slate-700"
              strokeWidth={2.5}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimatedSearch;
