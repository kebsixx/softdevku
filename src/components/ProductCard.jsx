"use client";

import Image from "next/image";
import { Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/CartContext";

function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <Card className="group">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-4 transition-transform group-hover:scale-105"
        />
        {product.isNew && <Badge className="absolute left-2 top-2">Baru</Badge>}
      </div>

      <CardHeader>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {product.category} · {product.brand}
        </p>
        <CardTitle className="line-clamp-2 normal-case tracking-normal">
          {product.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center gap-1 text-sm text-muted-foreground">
        <Star aria-hidden="true" className="size-3.5 fill-current" />
        <span>{product.rating}</span>
      </CardContent>

      <CardFooter className="mt-auto items-center justify-between gap-2">
        <div className="flex flex-col">
          {Number(product.oldPrice) > Number(product.price) && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          <span className="text-base font-semibold">
            {formatPrice(product.discountedPrice || product.price)}
          </span>
        </div>

        <Button size="sm" onClick={() => addToCart(product)}>
          <Plus aria-hidden="true" />
          Tambah
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ProductCard };
