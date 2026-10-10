"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

function CartSheet({ children }) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="relative gap-2" />
        }>
        {children}
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Keranjang Belanja</SheetTitle>
          <SheetDescription>
            {totalItems} item di keranjang
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag
              aria-hidden="true"
              className="size-10 text-muted-foreground"
            />
            <p className="font-heading text-lg uppercase tracking-wider">
              Keranjang kosong
            </p>
            <p className="max-w-[32ch] text-sm text-muted-foreground">
              Belum ada produk yang ditambahkan. Pilih produk dari katalog,
              lalu tekan Tambah.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-8">
              <div className="divide-y divide-border">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4 py-4">
                    <div className="relative size-16 shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-medium text-balance">
                          {item.title}
                        </p>
                        <span className="shrink-0 text-sm font-semibold tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-foreground/20">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => updateQuantity(item._id, "dec")}
                            aria-label={`Kurangi jumlah ${item.title}`}
                          >
                            <Minus aria-hidden="true" />
                          </Button>

                          <span className="w-7 text-center text-sm tabular-nums">
                            {item.quantity}
                          </span>

                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => updateQuantity(item._id, "inc")}
                            aria-label={`Tambah jumlah ${item.title}`}
                          >
                            <Plus aria-hidden="true" />
                          </Button>
                        </div>

                        <span className="text-xs tabular-nums text-muted-foreground">
                          {formatPrice(item.price)} per item
                        </span>

                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="ml-auto shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item._id)}
                          aria-label={`Hapus ${item.title} dari keranjang`}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="border-t border-border">
              <div className="flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">
                  Subtotal
                </span>
                <span className="text-lg font-semibold tabular-nums">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div>
                <Button className="w-full" size="lg" disabled>
                  Checkout
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Belum tersedia di tugas ini — subtotal di atas sudah final.
                </p>
              </div>

              <Button variant="ghost" className="w-full" onClick={clearCart}>
                Kosongkan keranjang
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export { CartSheet };
