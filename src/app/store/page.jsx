import { ProductGrid } from "@/components/ProductGrid";

const API_URL = "https://fakestoreapi.noksha.dev/api/products?perPage=100";

async function getProducts() {
  const res = await fetch(API_URL, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Fake Store API merespons ${res.status}`);
  }
  const payload = await res.json();
  return payload.data;
}

export const metadata = {
  title: "StoreDev — Katalog Produk",
  description: "Katalog produk interaktif dengan pencarian dan keranjang.",
};

export default async function StorePage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-border pb-5">
        <h1 className="font-heading text-3xl uppercase tracking-widest text-balance">
          Katalog Produk
        </h1>
        <p className="text-sm tabular-nums text-muted-foreground">
          {products.length} produk
        </p>
      </div>

      <ProductGrid products={products} />
    </main>
  );
}
