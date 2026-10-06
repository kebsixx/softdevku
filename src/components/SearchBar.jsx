"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/context/SearchContext";

function SearchBar() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();

  return (
    <div className="relative w-full">
      <Search
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Cari produk, kategori..."
        aria-label="Cari produk"
        className="pl-6 pr-6"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={clearSearch}
          aria-label="Bersihkan pencarian"
          className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export { SearchBar };
