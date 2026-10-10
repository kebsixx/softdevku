"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/context/SearchContext";

function SearchBar() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();

  return (
    <div className="flex h-10 w-full items-center gap-2 border border-foreground/20 bg-card px-3 transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
      <Search
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />

      <Input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Cari produk, kategori, merek..."
        aria-label="Cari produk"
        className="h-auto flex-1 border-0 p-0 text-sm focus-visible:border-0 focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Bersihkan pencarian"
          className="-mr-2 grid size-8 shrink-0 place-items-center text-muted-foreground transition-colors hover:text-foreground">
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  );
}

export { SearchBar };
