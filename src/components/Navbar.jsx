"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CartSheet } from "@/components/CartSheet";
import { SearchBar } from "@/components/SearchBar";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/store", label: "Store" },
  { href: "/diriku", label: "Diriku" },
  { href: "/mahasiswa", label: "Mahasiswa" },
];

function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  return (
    <header className="z-40 border-b border-border bg-background/85 backdrop-blur-md md:sticky md:top-0">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:h-16 md:flex-nowrap md:py-0">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-heading text-lg uppercase tracking-widest">
          <ShoppingBag aria-hidden="true" className="size-5" />
          StoreDev
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "text-sm uppercase tracking-widest text-foreground"
                    : "text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                }>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile: turun ke baris penuh. Desktop: mengisi ruang sisa. */}
        <div className="order-last w-full md:order-none md:w-auto md:max-w-md md:flex-1">
          <SearchBar />
        </div>

        <div className="ml-auto md:ml-0">
          <CartSheet>
            <ShoppingCart aria-hidden="true" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="sr-only">
              {totalItems > 0 ? `, ${totalItems} item` : ", kosong"}
            </span>
            {totalItems > 0 && (
              <Badge
                className="absolute -right-2 -top-2 tabular-nums"
                aria-hidden="true">
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
