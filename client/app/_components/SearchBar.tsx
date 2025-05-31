"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";
import { Search, Command } from "lucide-react";
import Link from "next/link";
import { SearchProps } from "../_types/search";

export default function SearchBar({
  placeholder = "Search anything...",
  results = [],
  onSearch,
  className = "",
  showCommands = true,
  value,
  onChange,
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside of search component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchFocused(true);
        const inputElement = searchRef.current?.querySelector("input");
        if (inputElement) {
          inputElement.focus();
        }
      }
      if (event.key === "Escape") {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onChange?.(query);
    onSearch?.(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onChange?.("");
    onSearch?.("");
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="flex items-center bg-base-300 rounded-lg px-3 py-1 w-full">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          className="bg-transparent border-none focus:outline-none px-2 w-full placeholder:text-muted-foreground text-sm"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
        {showCommands && (
          <kbd className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground ml-2">
            <Command className="h-3 w-3" />K
          </kbd>
        )}
      </div>

      {isSearchFocused && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-full min-w-[300px] bg-base-100 rounded-lg shadow-lg border border-base-300 py-2 z-50">
          {searchQuery && results.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.link}
                  className="flex items-start gap-3 px-4 py-2 hover:bg-base-200 transition-colors"
                  onClick={() => setIsSearchFocused(false)}
                >
                  <div className="mt-1">{result.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{result.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {result.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              Start typing to search...
            </div>
          )}

          {showCommands && (
            <div className="border-t border-base-300 mt-2 pt-2 px-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Press Enter to search all results</span>
                <span className="flex items-center gap-1">
                  <Command className="h-3 w-3" /> + K
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
