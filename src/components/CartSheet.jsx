"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
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

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

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
            <p className="font-heading text-lg uppercase tracking-wider">
              Keranjang kosong
            </p>
            <p className="text-sm text-muted-foreground">
              Belum ada produk yang ditambahkan.
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

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="line-clamp-2 text-sm font-medium">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)}
                      </p>

                      <div className="mt-1 flex items-center gap-2">
                        <Button
                          size="icon-xs"
                          variant="outline"
                          onClick={() => updateQuantity(item._id, "dec")}
                          aria-label={`Kurangi jumlah ${item.title}`}
                        >
                          <Minus aria-hidden="true" />
                        </Button>

                        <span className="min-w-6 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>

                        <Button
                          size="icon-xs"
                          variant="outline"
                          onClick={() => updateQuantity(item._id, "inc")}
                          aria-label={`Tambah jumlah ${item.title}`}
                        >
                          <Plus aria-hidden="true" />
                        </Button>

                        <Button
                          size="icon-xs"
                          variant="ghost"
                          className="ml-auto"
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
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-widest text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-heading text-xl">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Button className="w-full" size="lg" disabled>
                Checkout
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={clearCart}>
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
