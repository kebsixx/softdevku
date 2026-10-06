"use client";

import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "@/components/CartSheet";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/diriku", label: "Diriku" },
  { href: "/mahasiswa", label: "Mahasiswa" },
];

function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:gap-6">
        <Link
          href="/store"
          className="flex shrink-0 items-center gap-2 font-heading text-lg uppercase tracking-widest">
          <ShoppingBag aria-hidden="true" className="size-5" />
          StoreDev
        </Link>

        <nav aria-label="Navigasi utama" className="flex gap-4 md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center gap-3">
          <div className="flex-1">
            <SearchBar />
          </div>

          <CartSheet>
            <ShoppingCart aria-hidden="true" />
            <span className="sr-only">
              {totalItems > 0
                ? `Buka keranjang, ${totalItems} item`
                : "Buka keranjang, kosong"}
            </span>
            {totalItems > 0 && (
              <Badge className="absolute -right-2 -top-2 tabular-nums" aria-hidden="true">
                {totalItems}
              </Badge>
            )}
          </CartSheet>
        </div>
      </div>
    </header>
  );
}

export { Navbar };
