"use client";

import { useMemo } from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";

function ProductGrid({ products }) {
  const { searchQuery, clearSearch } = useSearch();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <SearchX aria-hidden="true" className="size-10 text-muted-foreground" />
        <p className="font-heading text-lg uppercase tracking-wider text-balance">
          {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
        </p>
        <p className="max-w-[38ch] text-sm text-muted-foreground">
          {searchQuery
            ? `Tidak ada produk yang cocok dengan "${searchQuery}".`
            : "Data produk gagal dimuat atau kosong."}
        </p>
        {searchQuery && (
          <Button variant="outline" size="sm" onClick={clearSearch}>
            Bersihkan pencarian
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export { ProductGrid };
