"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useMenu } from "@/contexts/MenuContext";
import { useSearch } from "@/contexts/SearchContext";
import { SvgIcon } from "@/components/common/SvgIcon";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { extractCategoryNames } from "@/lib/search-bar/utils";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";

const placeHolderCategoryNames = [
  "Burgers",
  "Pizza",
  "Drinks",
  "Desserts",
  "Fries",
];

const AnimatedSearch = () => {
  const { menu } = useMenu();
  const { setSearchQuery } = useSearch();

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearch = useDebouncedValue(inputValue, 400);
  const categoryNames = extractCategoryNames(menu || []).slice(0, 5) || placeHolderCategoryNames;
  const animatedText = useTypingAnimation(categoryNames, 80, 40, 1500);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch]);

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
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
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
          className="w-full h-11 sm:h-14 pl-12 sm:pl-16 pr-14 text-base rounded-full  border-2 border-slate-400 bg-white transition-all duration-300 ease-in-out shadow-sm outline-none focus:border-slate-600 focus:ring-[5px] focus:ring-slate-500/25 focus-visible:ring-slate-500/25"

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
