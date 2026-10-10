"use client";

import Image from "next/image";
import { Check, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

function ProductCard({ product }) {
  const { cart, addToCart } = useCart();

  const price = Number(product.price);
  const was = Number(product.oldPrice);
  const now = Number(product.discountedPrice) || price;
  const discount = was > now ? Math.round((1 - now / was) * 100) : 0;

  const inCart = cart.find((item) => item._id === product._id)?.quantity ?? 0;

  return (
    <Card
      size="sm"
      className="group h-full shadow-none ring-foreground/15 transition-colors hover:ring-foreground/40">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105"
        />

        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.isNew && <Badge className="bg-foreground text-background">Baru</Badge>}
          {discount > 0 && (
            <Badge variant="outline" className="border-foreground/25 bg-background/90 text-foreground">
              −{discount}%
            </Badge>
          )}
        </div>

        {inCart > 0 && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 gap-1 tabular-nums">
            <Check aria-hidden="true" className="size-3" />
            {inCart}
          </Badge>
        )}
      </div>

      <CardHeader className="gap-2">
        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="truncate">
            {product.category} · {product.brand}
          </span>
          <span className="flex shrink-0 items-center gap-1 tabular-nums">
            <Star aria-hidden="true" className="size-3 fill-current" />
            {product.rating}
          </span>
        </div>

        <CardTitle className="line-clamp-2 font-sans text-sm font-medium normal-case leading-snug tracking-normal">
          {product.title}
        </CardTitle>
      </CardHeader>

      <CardFooter className="mt-auto items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col">
          {discount > 0 && (
            <span className="text-xs tabular-nums text-muted-foreground line-through">
              {formatPrice(was)}
            </span>
          )}
          <span className="text-base font-semibold tabular-nums">
            {formatPrice(now)}
          </span>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => addToCart(product)}
          aria-label={`Tambah ${product.title} ke keranjang`}
          className="shrink-0 hover:bg-foreground hover:text-background">
          {inCart > 0 ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
          Tambah
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ProductCard };
