"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const SearchContext = createContext(null);

function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  const value = useMemo(
    () => ({ searchQuery, setSearchQuery, clearSearch }),
    [searchQuery, clearSearch],
  );

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch harus dipakai di dalam SearchProvider");
  }
  return context;
}

export { SearchProvider, useSearch };
