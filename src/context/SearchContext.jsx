"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = () => setSearchQuery("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
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
