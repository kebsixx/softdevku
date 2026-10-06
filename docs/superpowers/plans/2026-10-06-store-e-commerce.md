# Halaman E-Commerce `/store` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun halaman e-commerce di `/store` (fetch produk, search real-time, keranjang dengan localStorage) sesuai `AGENTS.md`, tanpa menghapus `/diriku` dan `/mahasiswa`.

**Architecture:** `store/page.jsx` adalah Server Component yang fetch 30 produk sekali jalan lalu mengirimkannya sebagai prop ke `ProductGrid` (Client Component) — batas server/client. `CartProvider` + `SearchProvider` di `store/layout.jsx` agar halaman lama tidak tersentuh. State keranjang di memory, disinkronkan ke `localStorage` dengan guard `hydrated`.

**Tech Stack:** Next.js 16.3.8 (App Router, Turbopack), React 19.2.8, JavaScript/JSX (no TypeScript), Tailwind CSS 4, shadcn/ui style `base-sera` (Base UI primitives, bukan Radix), `lucide-react`, `cn@0.3.2`.

**Spec:** `docs/superpowers/specs/2026-10-06-store-e-commerce-design.md`

---

## Global Constraints

- **Tanpa test framework.** Spec §8 dan `AGENTS.md` tidak meminta test; menambahkannya di luar scope. Verifikasi = `npm run lint` + `npm run build` + cek manual di browser. Skill TDD tidak berlaku di sini — instruksi user menang atas skill.
- **JavaScript only.** Tidak boleh ada `.ts` / `.tsx`. Semua file React `.jsx`, helper `.js`.
- **Tidak menambah dependency runtime baru.** Semua yang dibutuhkan sudah terpasang atau ditambahkan CLI di Task 1.
- **API:** `https://fakestoreapi.noksha.dev/api/products?perPage=100` — `?perPage=100` wajib, tanpa itu hanya 20 dari 30 produk terkirim.
- **Endpoint lama mati.** `fakestoreapi.reactbd.com` dan `fakestoreapi.in` mengembalikan HTML; `fakestoreapi.com` 521. Jangan dipakai.
- **Gambar produk dari `images.pexels.com`** — wajib ada di `next.config.mjs` `remotePatterns` (Task 2), kalau tidak HTTP 400.
- **Penamaan:** komponen PascalCase (`ProductCard.jsx`), helper/context camelCase (`cartContext.js`). Ini aturan `AGENTS.md` §4A — `cardku.jsx` yang ada sudah melanggar, tapi file lama tidak diubah penamaannya.
- **Styling:** token semantik (`bg-card`, `text-muted-foreground`, `bg-primary`), bukan warna raw (`bg-slate-50`). `base-sera` = `rounded-none`, `uppercase`, `tracking-widest`, `font-heading`.
- **Class merge:** `import { cn } from "cn"` — konsisten dengan 4 file di `src/components/ui/`. Jangan tambahkan `clsx`/`tailwind-merge`.
- **Commit message** gaya Conventional Commits, Bahasa Indonesia pada body.

---

## File Structure

**Dibuat (11 file):**

| Path | Tanggung jawab |
| :-- | :-- |
| `src/app/store/layout.jsx` | Provider Cart + Search, batas `/store` |
| `src/app/store/page.jsx` | Server Component, fetch produk, pass ke ProductGrid |
| `src/app/store/loading.jsx` | Skeleton grid saat `await` |
| `src/app/store/error.jsx` | Error boundary + tombol retry |
| `src/context/CartContext.jsx` | State keranjang + localStorage |
| `src/context/SearchContext.jsx` | `searchQuery` global |
| `src/components/Navbar.jsx` | Header + SearchBar + trigger CartSheet + badge |
| `src/components/SearchBar.jsx` | Input search + tombol clear |
| `src/components/ProductGrid.jsx` | Grid responsif + filter + empty state |
| `src/components/ProductCard.jsx` | Card produk + tombol add |
| `src/components/CartSheet.jsx` | Drawer keranjang |

**Dimodifikasi (7 file):**

| Path | Perubahan |
| :-- | :-- |
| `next.config.mjs` | + `images.pexels.com` di `remotePatterns` |
| `src/app/page.jsx` | Landing page, 3 link, `<Link>` bukan `<a>` |
| `src/app/layout.jsx` | Rapi duplikat `Playfair_Display` |
| `src/app/mahasiswa/page.jsx` | Bug hapus-salah-item → berbasis `id` |
| `src/components/cardku.jsx` | Terima prop `id` (tampilan tak berubah) |
| `AGENTS.md` | Endpoint baru, Base UI bukan Radix, persistensi |
| `DESIGN.md` | Rewrite ke base-sera aktual + spec `/store` |

**Sudah di-rename sebelumnya:** `Architechture.md` → `Architecture.md` (sudah ada, tidak perlu dikerjakan lagi)

**Tidak disentuh:** `src/app/diriku/page.jsx`, `src/app/globals.css`, `src/components/ui/*`, `src/lib/utils.js`

---

## Task 1: Komponen UI shadcn (sheet, scroll-area, skeleton)

Spec §9.1 memperkirakan `npx shadcn@latest add` mungkin gagal. **Investigasi membuktikan lebih buruk dari dugaan:** dependensi `shadcn@1.0.0` yang terpasang di `package.json` adalah **stub kosong** — `node_modules/shadcn/package.json` hanya berisi `{"name":"shadcn","version":"1.0.0","main":"index.js"}`, tapi `index.js` tidak ada, tidak ada `bin`, tidak ada kode. CLI asli ada di `shadcn@4.21.2`.

Karena `shadcn` muncul di `dependencies` (bukan `devDependencies`), `npx shadcn` akan memakai stub lokal dan gagal. Task ini melepas stub itu dan memasang CLI asli.

**Files:**
- Create: `src/components/ui/sheet.jsx`
- Create: `src/components/ui/scroll-area.jsx`
- Create: `src/components/ui/skeleton.jsx`

**Interfaces:**
- Consumes: `@base-ui/react/dialog`, `@base-ui/react/scroll-area`, `lucide-react`, `cn`, `@/components/ui/button`
- Produces: `Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription`; `ScrollArea, ScrollBar`; `Skeleton`

> **SUDAH SELESAI SEBELUM TASK INI.** Pemeriksaan pra-flight menemukan `shadcn@1.0.0`
> terpasang sebagai stub kosong (`main: index.js` tapi file-nya tidak ada, tanpa `bin`).
> Penyebabnya perubahan belum-commit yang menurunkan `shadcn` dari `4.21.0` → `1.0.0`.
> Sudah dipulihkan ke `4.21.2` (CLI asli, `dist/` ada) dan diverifikasi. Step 1 dihapus
> karena tidak ada yang perlu dikerjakan — langsung lanjut Step 2 (sekarang Step 1).

- [ ] **Step 1: Tambah 3 komponen**

CLI sudah terpasang dan berfungsi. Verifikasi cepat:

```bash
node -e "console.log(require('shadcn/package.json').version)"
```

Expected: `4.21.2`

Lalu:

```bash
npx shadcn@latest add sheet scroll-area skeleton
```

Expected output: `Success! 3 components added.` — dan `src/components/ui/sheet.jsx`, `scroll-area.jsx`, `skeleton.jsx` dibuat.

CLI membaca `components.json` (`tsx: false`, `style: base-sera`, alias `@/components`, `@/lib/utils`), jadi file harus jadi `.jsx` dengan import ter-resolve ke `@/`.

- [ ] **Step 2: Verifikasi hasil CLI tidak mengandung artefak create-app**

Source registry mentah (`https://ui.shadcn.com/r/styles/base-sera/sheet.json`) berisi import yang **tidak boleh** ada di project kita:

```jsx
import { Button } from "@/registry/base-sera/ui/button"        // ← harus jadi @/components/ui/button
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"  // ← harus hilang
className="cn-font-heading ..."                                // ← harus jadi font-heading
```

Registry juga mengirim `.tsx`; project kita JS-only.

Periksa ketiga file:

```bash
Select-String -Path src/components/ui/sheet.jsx,src/components/ui/scroll-area.jsx,src/components/ui/skeleton.jsx -Pattern "registry/base-sera|IconPlaceholder|cn-font-heading|\.tsx"
```

Expected: **tidak ada output.** Kalau ada, CLI gagal transform — diperbaiki manual di Step 4.

- [ ] **Step 3: Bersihkan artefak yang lolos (hanya bila Step 2 menemukan sesuatu)**

Ganti di `src/components/ui/sheet.jsx`:

```jsx
// dari:
import { IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" />
// menjadi:
import { XIcon } from "lucide-react"
```

Perhatikan tanda koma yang hilang pada baris `import` — baca baris aslinya dari file, jangan memakai pola di atas secara harfiah.

Import `@/registry/base-sera/ui/button` → `@/components/ui/button`.
`cn-font-heading` → `font-heading`.

- [ ] **Step 4: Pastikan tidak ada file `.tsx` bocor**

```bash
Get-ChildItem -Recurse src -Include *.tsx,*.ts
```

Expected: **tidak ada output.**

- [ ] **Step 5: Lint + build**

```bash
npm run lint
npm run build
```

Expected: build sukses, tanpa error TypeScript/JSX.

> `eslint-config-next` sudah dipulihkan ke `16.3.5` (cocok dengan Next 16) sebelum
> eksekusi plan, jadi `npm run lint` di sini Signifikan — bukan pre-existing breakage
> seperti yang diperkirakan spec §9.3. Kalau lint gagal, itu kesalahan di file kita.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/sheet.jsx src/components/ui/scroll-area.jsx src/components/ui/skeleton.jsx
git commit -m "feat: tambah sheet, scroll-area, dan skeleton dari shadcn"
```

---

## Task 2: `remotePatterns` untuk gambar produk

Tanpa ini setiap `<Image>` produk dapat HTTP 400 dan grid tampil kosong.

**Files:**
- Modify: `next.config.mjs:3-12`

**Interfaces:**
- Consumes: hostname `images.pexels.com` (dari response API)
- Produces: konfigurasi yang mengizinkan optimasi `next/image` untuk host tersebut

- [ ] **Step 1: Tambah pattern**

Ganti blok `images` di `next.config.mjs`:

```js
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
```

`images.unsplash.com` **tetap** — dipakai `src/app/diriku/page.jsx:17` yang tidak boleh rusak.

- [ ] **Step 2: Verifikasi config terbaca**

```bash
npm run build
```

Expected: build sukses.

Yang terbukti penuh baru saat halaman `/store` dirender dan gambarnya termuat — itu dicek di Task 11. Kalau gambar 400 muncul nanti, referensikan spec §9.2.

- [ ] **Step 3: Commit**

```bash
git add next.config.mjs
git commit -m "feat: izinkan images.pexels.com untuk optimasi next/image"
```

---

## Task 3: `SearchContext`

**Files:**
- Create: `src/context/SearchContext.jsx`

**Interfaces:**
- Consumes: tidak ada
- Produces: `SearchProvider({ children })`, `useSearch()` → `{ searchQuery, setSearchQuery, clearSearch }`

- [ ] **Step 1: Tulis context**

```jsx
"use client";

import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = () => setSearchQuery("");

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch harus dipakai di dalam SearchProvider");
  }
  return context;
}

export { SearchProvider, useSearch };
```

Guard `if (!context)` mencegah error "`Cannot read properties of null`" yang membingungkan — diganti pesan yang menyebut provider-nya.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/context/SearchContext.jsx
git commit -m "feat: tambah SearchContext untuk query pencarian produk"
```

---

## Task 4: `CartContext` dengan localStorage

Bagian terpenting secara teknis. Tanpa guard `hydrated`, cart hilang permanen setelah refresh.

**Files:**
- Create: `src/context/CartContext.jsx`

**Interfaces:**
- Consumes: tidak ada
- Produces: `CartProvider({ children })`, `useCart()` → `{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }`

- [ ] **Step 1: Tulis context**

```jsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "softdevku-cart";

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      setCart([]);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = (product) => {
    setCart((items) => {
      const existing = items.find((item) => item._id === product._id);
      if (existing) {
        return items.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...items,
        {
          _id: product._id,
          title: product.title,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((items) => items.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, type) => {
    setCart((items) =>
      items
        .map((item) => {
          if (item._id !== productId) return item;
          const quantity =
            type === "inc" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return context;
}

export { CartProvider, useCart };
```

Tiga keputusan yang perlu dipahami, bukan sekadar disalin:

1. **Guard `hydrated`** — effect kedua menyimpan `cart` setiap kali berubah. Tanpa `if (hydrated)`, effect itu jalan sekali dengan `cart = []` sebelum effect pertama selesai restore, menimpa localStorage dengan `[]`. Cart hilang permanen, dan tidak akan ketahuan kalau tidak diuji lewat refresh.
2. **`try/catch`** — `JSON.parse` melempar exception kalau localStorage berisi JSON rusak (mis. diedit manual di DevTools). Tanpa itu, white screen.
3. **`updateQuantity` me-filter `quantity > 0`** — tombol `Minus` di quantity 1 menghapus item, bukan membuat quantity 0. `CartSheet` jadi tidak perlu logika "apakah harus sembunyikan tombol minus".

Pakai `STORAGE_KEY = "softdevku-cart"`, bukan `"cart"` — menghindari tabrakan dengan key generik milik app lain di origin yang sama.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/context/CartContext.jsx
git commit -m "feat: tambah CartContext dengan persistensi localStorage"
```

---

## Task 5: Provider di `store/layout.jsx`

Menaruh provider di sini, bukan root, supaya `/diriku` dan `/mahasiswa` benar-benar tidak tersentuh.

**Files:**
- Create: `src/app/store/layout.jsx`

**Interfaces:**
- Consumes: `CartProvider`, `SearchProvider` (Task 3, Task 4)
- Produces: layout yang membungkus seluruh subtree `/store`

- [ ] **Step 1: Tulis layout**

```jsx
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";

export default function StoreLayout({ children }) {
  return (
    <CartProvider>
      <SearchProvider>{children}</SearchProvider>
    </CartProvider>
  );
}
```

Tidak perlu `"use client"` — file yang mengimpor Client Component (`CartContext.jsx`) sudah punya direktif itu sendiri, dan Next memperlakukannya sebagai Client Component Boundary dengan otomatis.

`CartProvider` di luar `SearchProvider` tidak penting secara fungsional (keduanya tidak saling baca), tapi urutan ini mengikuti spec §3.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/app/store/layout.jsx
git commit -m "feat: bungkus /store dengan CartProvider dan SearchProvider"
```

---

## Task 6: `SearchBar`

**Files:**
- Create: `src/components/SearchBar.jsx`

**Interfaces:**
- Consumes: `useSearch()` dari `@/context/SearchContext` (Task 3), `Input` dari `@/components/ui/input`
- Produces: `SearchBar()` — controlled input yang menulis ke `searchQuery`

- [ ] **Step 1: Tulis komponen**

```jsx
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
```

`Input` di `src/components/ui/input.jsx:15` memakai `px-0` dan border bawah saja (`border-b-input`), jadi ikon di dalam input butuh `pl-6`/`pr-6` untuk tidak menabrak border bawah.

`type="search"` memberi tombol clear bawaan browser di sebagian browser — `X` kustom kita tetap perlu untuk yang tidak menampilkannya, dan supaya konsisten lintas browser.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/components/SearchBar.jsx
git commit -m "feat: tambah SearchBar dengan tombol bersihkan"
```

---

## Task 7: `ProductCard`

**Files:**
- Create: `src/components/ProductCard.jsx`

**Interfaces:**
- Consumes: `useCart()` dari `@/context/CartContext` (Task 4), `Card`/`CardContent`/`CardHeader`/`CardTitle`/`CardFooter` dari `@/components/ui/card`, `Button` dari `@/components/ui/button`, `Badge` dari `@/components/ui/badge`, `Image` dari `next/image`
- Produces: `ProductCard({ product })` — `product` berisi `_id, title, description, category, price, oldPrice, discountedPrice, isNew, brand, rating, image`

- [ ] **Step 1: Tulis komponen**

```jsx
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
        {product.isNew && (
          <Badge className="absolute left-2 top-2">Baru</Badge>
        )}
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
```

Tiga penyesuaian dari spec §6.2, semuanya karena `base-sera`:

- `CardTitle` di `src/components/ui/card.jsx:46` sudah `uppercase tracking-wider`. Judul produk jadi `"LONG SLEEVE JACKET"` — salah baca. `normal-case tracking-normal` menetralkan itu.
- `Card` di `card.jsx:14` sudah punya `overflow-hidden` dan `*:[img:first-child]:rounded-none`, tapi gambar dibungkus `div` sendiri dengan `aspect-square` supaya aspect ratio konsisten dan `p-4` untuk `object-contain`.
- Harga memakai `discountedPrice || price` — response API punya kedua field, dan `discountedPrice` selalu ≤ `price`.

`oldPrice` datang dari API sebagai **string** (`"200"`), `price` sebagai number (`150`) — formatPrice memakai `Number()` supaya keduanya konsisten.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductCard.jsx
git commit -m "feat: tambah ProductCard dengan badge baru, harga coret, dan tombol tambah"
```

---

## Task 8: `ProductGrid`

**Files:**
- Create: `src/components/ProductGrid.jsx`

**Interfaces:**
- Consumes: `products` (prop dari Server Component), `useSearch()` dari `@/context/SearchContext`, `ProductCard` (Task 7), `Skeleton` dari `@/components/ui/skeleton`
- Produces: `ProductGrid({ products })`

- [ ] **Step 1: Tulis komponen**

```jsx
"use client";

import { useMemo } from "react";
import { SearchX } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";

function ProductGrid({ products }) {
  const { searchQuery } = useSearch();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) =>
      product.title.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query),
    );
  }, [products, searchQuery]);

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <SearchX aria-hidden="true" className="size-10 text-muted-foreground" />
        <p className="font-heading text-lg uppercase tracking-wider">
          {searchQuery
            ? `Produk "${searchQuery}" tidak ditemukan`
            : "Belum ada produk"}
        </p>
        <p className="text-sm text-muted-foreground">
          {searchQuery
            ? "Coba kata kunci lain atau bersihkan pencarian."
            : "Data produk gagal dimuat atau kosong."}
        </p>
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
```

`key={product._id}` — bukan index — supaya React tidak salah reuse DOM saat filter berubah.

`Skeleton` **tidak** diimpor di file ini; `loading.jsx` mengambilnya langsung dari
`@/components/ui/skeleton`. Import yang tidak dipakai akan memicu lint error, dan
`loading.jsx` adalah Server Component-able boundary sehingga tidak perlu `ProductGrid`
mengekspor apa pun.

`product.brand.toLowerCase()` aman: field `brand` selalu ada di response API. Kalau ada
produk yang `brand`-nya null, baris ini akan throw — data saat ini semua terisi, jadi
tidak perlu guard.

- [ ] **Step 2: Verifikasi tidak ada import tak terpakai**

```bash
Select-String -Path src/components/ProductGrid.jsx -Pattern "Skeleton"
```

Expected: **tidak ada output.** Kalau ada, hapus baris import `Skeleton` — komponen ini
tidak memakai skeleton; `loading.jsx` yang menampilkan skeleton.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: bersih. Kalau ada error `Skeleton is defined but never used`, Task 8 Step 1–2 belum diterapkan berurutan.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProductGrid.jsx
git commit -m "feat: tambah ProductGrid dengan filter real-time dan empty state"
```

---

## Task 9: `CartSheet`

**Files:**
- Create: `src/components/CartSheet.jsx`

**Interfaces:**
- Consumes: `useCart()` dari `@/context/CartContext` (Task 4), `Sheet*` dari `@/components/ui/sheet` (Task 1), `ScrollArea`/`ScrollBar` dari `@/components/ui/scroll-area` (Task 1), `Button`, `Badge`, `Image`
- Produces: `CartSheet({ children })` — `children` adalah elemen trigger button

- [ ] **Step 1: Tulis komponen**

```jsx
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
} from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
        render={<Button variant="outline" size="sm" />}
        className="gap-2"
      >
        {children}
      </SheetTrigger>

      <SheetContent side="right" aria-describedby="cart-description">
        <SheetHeader>
          <SheetTitle>Keranjang Belanja</SheetTitle>
          <SheetDescription id="cart-description">
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
                          onClick={() =>
                            updateQuantity(item._id, "dec")
                          }
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
                          onClick={() =>
                            updateQuantity(item._id, "inc")
                          }
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
              <ScrollBar orientation="vertical" />
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
```

Tiga keputusan yang perlu dipertimbangkan:

1. **`SheetTrigger render={<Button />}`** — Base UI memakai prop `render`, bukan `asChild` seperti Radix. Ini perbedaan API yang wajib diketahui; `asChild` tidak ada di Base UI dan akan diabaikan.
2. **Tombol Checkout `disabled`** — sesuai spec §10, checkout di luar scope. Tombol yang
   selalu mati lebih jujur daripada navigasi ke halaman yang tidak ada, dan `DESIGN.md`
   §3D memang meminta tombolnya ada.
3. **`updateQuantity(id, "dec")` di quantity 1 menghapus item** — sudah ditangani `CartContext` (Task 4, filter `quantity > 0`), jadi `CartSheet` tidak perlu logika kondisional.

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/components/CartSheet.jsx
git commit -m "feat: tambah CartSheet dengan kontrol kuantitas dan subtotal"
```

---

## Task 10: `Navbar`

**Files:**
- Create: `src/components/Navbar.jsx`

**Interfaces:**
- Consumes: `useCart()` (Task 4), `SearchBar` (Task 6), `CartSheet` (Task 9), `Badge`, `Button`, `Link` dari `next/link`
- Produces: `Navbar()` — header sticky `/store` dengan link navigasi, search, badge cart

- [ ] **Step 1: Tulis komponen**

```jsx
"use client";

import Link from "next/link";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
            <span className="sr-only">Buka keranjang</span>
            {totalItems > 0 && (
              <Badge
                className="absolute -right-2 -top-2 tabular-nums"
                aria-hidden="true"
              >
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
```

Badge `aria-hidden` karena jumlah sudah tersampaikan lewat `sr-only` "Buka keranjang" dan `SheetDescription` yang berbunyi "N item di keranjang" — mengulang angka yang sama dua kali untuk screen reader hanya menambah manure.

Link `/diriku` dan `/mahasiswa` ada di sini supaya halaman lama bisa dicapai dari `/store`, sekaligus memenuhi rencana "home page mengarah ke halaman".

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: tambah Navbar dengan navigasi, pencarian, dan badge keranjang"
```

---

## Task 11: Halaman `/store` (page, loading, error)

Tiga file ini adalah deliverable utama. `page.jsx` fetch, `loading.jsx` menangani `await`, `error.jsx` menangkap `throw`.

**Files:**
- Create: `src/app/store/page.jsx`
- Create: `src/app/store/loading.jsx`
- Create: `src/app/store/error.jsx`

**Interfaces:**
- Consumes: `Navbar` (Task 10), `ProductGrid` (Task 7), `Skeleton` (Task 1)
- Produces: route `/store` yang merender 30 produk

- [ ] **Step 1: Tulis `loading.jsx`**

```jsx
import { Skeleton } from "@/components/ui/skeleton";

function StoreLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    </main>
  );
}

export default StoreLoading;
```

`Skeleton` tidak butuh `"use client"` — dia presentational murni. 8 skeleton sesuai spec §3E, menjaga tinggi layout agar tidak ada layout shift.

- [ ] **Step 2: Tulis `error.jsx`**

```jsx
"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

function StoreError({ error, reset }) {
  return (
    <main className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-20 text-center">
      <AlertTriangle
        aria-hidden="true"
        className="size-10 text-destructive"
      />
      <h1 className="font-heading text-2xl uppercase tracking-widest">
        Gagal memuat produk
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Tidak bisa menghubungi Fake Store API. Periksa koneksi internet lalu
        coba lagi.
      </p>
      <p className="font-mono text-xs text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Coba lagi</Button>
    </main>
  );
}

export default StoreError;
```

`"use client"` wajib — `error.jsx` menerima `error` dan `reset`, yang hanya boleh dipanggil dari Client Component. `reset()` menggantikan `window.location.reload()`, jadi state React di luar boundary tidak ikut hilang.

`error.message` ditampilkan karena ini tugas belajar —_stack trace tidak, tapi pesan errornya membantu.

- [ ] **Step 3: Tulis `page.jsx`**

```jsx
import { Navbar } from "@/components/Navbar";
import { ProductGrid } from "@/components/ProductGrid";

const API_URL = "https://fakestoreapi.noksha.dev/api/products?perPage=100";

async function getProducts() {
  const res = await fetch(API_URL);
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
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl uppercase tracking-widest">
            Katalog Produk
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} produk siap dijelajahi
          </p>
        </div>

        <ProductGrid products={products} />
      </main>
    </>
  );
}
```

`payload.data` — API membungkus respons dalam `{ data, totalProducts, totalPages, currentPage, perPage }`. Lupa `.data` berarti `products` jadi objek metadata, bukan array, dan `.filter` di `ProductGrid` akan crash.

`metadata` diekspor dari Server Component (bukan Client Component) — itu yang membuatnya bekerja.

- [ ] **Step 4: Lint + build**

```bash
npm run lint
npm run build
```

Expected: build sukses, route `/store` muncul di output.

- [ ] **Step 5: Commit**

```bash
git add src/app/store/page.jsx src/app/store/loading.jsx src/app/store/error.jsx
git commit -m "feat: tambah halaman /store dengan fetch, loading skeleton, dan error boundary"
```

---

## Task 12: Landing page di `/`

**Files:**
- Modify: `src/app/page.jsx:1-17`

**Interfaces:**
- Consumes: `Button`, `Card*`, `Link` dari `next/link`
- Produces: route `/` yang menautkan ke `/store`, `/diriku`, `/mahasiswa`

- [ ] **Step 1: Ganti isi file**

```jsx
import Link from "next/link";
import { GraduationCap, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PAGES = [
  {
    href: "/store",
    icon: ShoppingBag,
    title: "StoreDev",
    description:
      "Katalog produk dengan pencarian real-time dan keranjang belanja. Tugas minggu ini.",
  },
  {
    href: "/diriku",
    icon: User,
    title: "Diriku",
    description: "Kartu profil singkat. Percobaan minggu sebelumnya.",
  },
  {
    href: "/mahasiswa",
    icon: GraduationCap,
    title: "Mahasiswa",
    description:
      "Daftar mahasiswa dengan tambah, hapus, dan pencarian. Percobaan minggu sebelumnya.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-4xl uppercase tracking-widest">
          Softdev Hacker Project
        </h1>
        <p className="mt-2 text-muted-foreground">
          Latihan Next.js dari UKM Softdev
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
        {PAGES.map((page) => {
          const Icon = page.icon;
          return (
            <Card key={page.href}>
              <CardHeader>
                <Icon aria-hidden="true" className="size-6 text-muted-foreground" />
                <CardTitle>{page.title}</CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Link href={page.href} className="w-full">
                  <Button className="w-full">Buka</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
```

`next/link` menggantikan `<a href>` yang ada di `src/app/page.jsx:9,12` — `<a>` internal di Next.js memicu full page reload, membuang seluruh state client. Body English "Welcome to My App" diganti Bahasa Indonesia supaya konsisten dengan halaman lain.

`<Link>` membungkus `<Button>` (bukan `render` prop) karena ini bukan komponen Base UI primitive — `Link` sudah benar untuk navigasi.

- [ ] **Step 2: Lint + build**

```bash
npm run lint
npm run build
```

Expected: bersih.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.jsx
git commit -m "feat: landing page dengan tautan ke /store, /diriku, dan /mahasiswa"
```

---

## Task 13: Perbaikan `mahasiswa` (bug hapus-salah-item)

Bug: `handleHapus(index)` menerima index dari `mahasiswaFiltered` lalu `splice` ke array `mahasiswa` — **menghapus mahasiswa yang salah setiap kali pencarian aktif**.

**Files:**
- Modify: `src/app/mahasiswa/page.jsx:13-28, 55-61`
- Modify: `src/components/cardku.jsx:3, 10-12`

**Interfaces:**
- Consumes: tidak ada
- Produces: penghapusan berbasis `id`, `Cardku` menerima prop `id`

- [ ] **Step 1: Ubah `handleTambah` dan `handleHapus`**

Di `src/app/mahasiswa/page.jsx`, ganti handler saat ini:

```jsx
const handleTambah = () => {
  setMahasiswa([...mahasiswa, { nama: namaBaru }]);
  setNamaBaru("");
};

const handleHapus = (index) => {
  const updatedMahasiswa = [...mahasiswa];
  updatedMahasiswa.splice(index, 1);
  setMahasiswa(updatedMahasiswa);
};
```

dengan:

```jsx
const handleTambah = () => {
  const nama = namaBaru.trim();
  if (nama === "") return;

  setMahasiswa([...mahasiswa, { id: crypto.randomUUID(), nama }]);
  setNamaBaru("");
};

const handleHapus = (id) => {
  setMahasiswa(mahasiswa.filter((mhs) => mhs.id !== id));
};
```

Guard `nama.trim() === ""` yang sudah ada di `page.jsx:14` ikut dipertahankan di dalam versi baru.

`crypto.randomUUID()` tersedia di browser modern tanpa import. `nama` sengaja tidak dipakai sebagai identitas — dua mahasiswa boleh sama-sama bernama "Budi", lalu salah satunya tidak terhapus.

- [ ] **Step 2: Ubah pemanggilan dan key**

Ganti pemanggilan `Cardku` di `src/app/mahasiswa/page.jsx`:

```jsx
{mahasiswaFiltered.map((mhs, index) => (
  <Cardku
    key={index}
    name={mhs.nama}
    handleHapus={() => handleHapus(index)}
  />
))}
```

dengan:

```jsx
{mahasiswaFiltered.map((mhs) => (
  <Cardku
    key={mhs.id}
    id={mhs.id}
    name={mhs.nama}
    handleHapus={() => handleHapus(mhs.id)}
  />
))}
```

`key={index}` → `key={mhs.id}` supaya React tidak salah reuse DOM saat filter berubah.

- [ ] **Step 3: Teruskan `id` di `cardku.jsx`**

Ganti signature dan pemanggilan `onClick` di `src/components/cardku.jsx`:

```jsx
export default function Cardku({ id, name, handleHapus }) {
  return (
    <div className="border p-4 bg-white dark:bg-gray-800 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>

      <Button
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={() => handleHapus(id)}
      >
        Hapus
      </Button>
    </div>
  );
}
```

Tampilan `Cardku` tidak berubah sama sekali — satu prop `id` masuk, `handleHapus` menerima argumen.

- [ ] **Step 4: Lint + build**

```bash
npm run lint
npm run build
```

Expected: bersih.

- [ ] **Step 5: Verifikasi manual di browser**

Jalankan `npm run dev`, buka `/mahasiswa`:

1. Tambah 3 mahasiswa: `Andi`, `Budi`, `Citra`
2. Ketik `a` di search → harusnya hanya `Andi`
3. Klik **Hapus** pada `Andi`
4. **Harus:** `Andi` hilang, `Budi` dan `Citra` utuh
5. **Sebelum fix:** `Budi` yang terhapus (index 0 di `mahasiswaFiltered` menunjuk `Andi` di array asli, tapi setelah `splice` posisi bergeser)

- [ ] **Step 6: Commit**

```bash
git add src/app/mahasiswa/page.jsx src/components/cardku.jsx
git commit -m "fix: hapus mahasiswa berdasarkan id, bukan index hasil filter"
```

---

## Task 14: Rapi `layout.jsx`

**Files:**
- Modify: `src/app/layout.jsx:1-33`

**Interfaces:**
- Consumes: tidak ada
- Produces: layout root dengan satu instansi font, tanpa perubahan visual

- [ ] **Step 1: Gabung dua instansi Playfair**

Ganti blok font di `src/app/layout.jsx:1-15`:

```jsx
import { Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });
```

`PlayfairDisplay` kedua (`layout.jsx:12-15`) dihapus. Alasannya: tanpa `variable`, `Playfair_Display` menghasilkan `className` yang langsung override `font-family` — lalu `font-sans` di elemen `<html>` yang sama (`layout.jsx:30`) menang, dan font heading praktis tidak pernah dipakai. `--font-heading` sekarang jadi satu-satunya sumber heading font.

- [ ] **Step 2: Rapikan `cn` di elemen html**

Ganti baris 26–33:

```jsx
      <html
        lang="id"
        className={cn(
          "h-full antialiased font-sans",
          notoSans.variable,
          playfairDisplay.variable,
        )}>
```

`lang="en"` → `lang="id"`: seluruh copy aplikasi Bahasa Indonesia. `display="swap"` ikut hilang bersama instansi yang dihapus — default `next/font` sudah `swap`.

- [ ] **Step 3: Lint + build**

```bash
npm run lint
npm run build
```

Expected: bersih.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.jsx
git commit -m "refactor: gabung duplikat Playfair Display dan set lang ke id"
```

---

## Task 15: Perbaiki dokumen

Spec §7.5. Empat file, satu di antaranya di-rename.

**Files:**
- Modify: `Architecture.md` (sudah di-rename dari `Architechture.md`)
- Modify: `AGENTS.md`
- Rewrite: `DESIGN.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: tidak ada
- Produces: dokumentasi yang cocok dengan kode

- [ ] **Step 1: Rename dengan preserving history**

`Architecture.md` sudah ada — Someone sudah mengganti `Architechture.md` → `Architecture.md`
sebelum eksekusi plan. Tidak ada yang perlu di-rename.

Verifikasi bahwa tidak ada file typo yang tertinggal:

```bash
Get-ChildItem -Filter "*rchitect*"
```

Expected: hanya `Architecture.md`. Kalau `Architechture.md` masih ada, rename dengan
`Move-Item -LiteralPath "Architechture.md" -Destination "Architecture.md"`.

- [ ] **Step 2: Perbarui `AGENTS.md`**

Tiga perubahan:

1. Ganti baris data source:

```markdown
- **Data Source:** `https://fakestoreapi.noksha.dev/api/products?perPage=100`
```

`?perPage=100` wajib — tanpa, API hanya mengirim 20 dari 30 produk. Endpoint lama (`fakestoreapi.reactbd.com`) sudah mati: mengembalikan HTML, bukan JSON.

2. Ganti baris UI Components:

```markdown
- **UI Components:** shadcn/ui style `base-sera` (berbasis **Base UI** primitives, bukan Radix)
```

3. Tambahkan poin baru di §3 setelah modul Cart Management:

```markdown
4. **Persistensi Keranjang:**
   - State keranjang disinkronkan ke `localStorage` (key `softdevku-cart`).
   - Restore dilakukan di `useEffect` dengan guard `hydrated` agar tidak menimpa data yang baru dibaca.
```

4. Ganti baris State Management:

```markdown
- **State Management:** React Context API (`CartContext` & `SearchContext`, di `src/context/`)
```

Provider hanya di `src/app/store/layout.jsx`, bukan root — halaman `/diriku` dan `/mahasiswa` tidak memakai cart.

- [ ] **Step 3: Rewrite `DESIGN.md`**

Ganti seluruh isi dengan:

````markdown
# UI/UX Design System & Layout Specs

Dokumen ini mendeskripsikan panduan visual, tata letak antarmuka, dan spesifikasi
komponen. Acuan adalah style **`base-sera`** yang sudah terpasang di
`components.json` — bukan guideline generik.

---

## 1. Bahasa Visual

| Aspek | Nilai | Sumber |
| :-- | :-- | :-- |
| Style | `base-sera` | `components.json` |
| Primitives | Base UI (`@base-ui/react`) | `package.json` |
| Radius | `rounded-none` di semua komponen | `src/components/ui/*.jsx` |
| Heading font | Playfair Display → `font-heading` | `src/app/layout.jsx` |
| Body font | Noto Sans → `font-sans` | `src/app/layout.jsx` |
| Base color | taupe (oklch) | `components.json`, `globals.css` |

### 1.1 Palette

Semua warna lewat token semantik. **Jangan pakai warna raw** seperti `bg-slate-50`
atau `text-emerald-600` — token itu tidak ada di tema ini.

| Token | Class | Pemakaian |
| :-- | :-- | :-- |
| `--background` | `bg-background`, `text-foreground` | Latar halaman, teks utama |
| `--card` | `bg-card`, `text-card-foreground` | Permukaan card |
| `--primary` | `bg-primary`, `text-primary-foreground` | Tombol utama, aksen |
| `--secondary` | `bg-secondary`, `text-secondary-foreground` | Tombol sekunder, badge |
| `--muted` | `bg-muted`, `text-muted-foreground` | Placeholder, skeleton, teks pendukung |
| `--accent` | `bg-accent`, `text-accent-foreground` | Hover halus |
| `--destructive` | `text-destructive`, `bg-destructive/10` | Aksi hapus, error |
| `--border` | `border-border` | Garis pemisah |
| `--ring` | `ring-ring` | Focus ring |

Mode gelap lewat `.dark` — bloknya sudah lengkap di `src/app/globals.css:42-74`.
Aktif dengan kelas `.dark` di elemen `<html>`.

### 1.2 Radius

`--radius: 0.625rem` (`globals.css:31`), diturunkan ke `--radius-sm` sampai
`--radius-4xl`. Tapi komponen base-sera tetap `rounded-none` — skala radius hanya
untuk elemen non-komponen.

---

## 2. Tipografi

- **Heading:** `font-heading` (Playfair Display). `CardTitle` dan `SheetTitle`
  sudah membawa `uppercase tracking-wider` secara default.
- **Body:** `font-sans` (Noto Sans).
- **Overriding default:** untuk teks yang **bukan** judul bergaya (mis. nama produk),
  tambahkan `normal-case tracking-normal` supaya tidak teruppercase.

Contoh benar:

```jsx
<CardTitle className="line-clamp-2 normal-case tracking-normal">
  Long sleeve Jacket
</CardTitle>
```

---

## 3. Route

| Route | Sumber | Keterangan |
| :-- | :-- | :-- |
| `/` | `src/app/page.jsx` | Landing, tautan ke 3 halaman |
| `/store` | `src/app/store/` | **Tugas minggu ini** — katalog + cart |
| `/diriku` | `src/app/diriku/` | Percobaan minggu sebelumnya |
| `/mahasiswa` | `src/app/mahasiswa/` | Percobaan minggu sebelumnya |

`/store` punya `layout.jsx` sendiri yang membungkus `CartProvider` + `SearchProvider`.
Route lain tidak punya context cart.

---

## 4. Spesifikasi `/store`

### A. Navbar — `src/components/Navbar.jsx`

- Sticky: `sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md`
- Brand `StoreDev` dengan icon `ShoppingBag`, font heading, uppercase tracking-widest
- Navigasi: Beranda, Diriku, Mahasiswa
- `SearchBar` di tengah, fleksibel
- `CartSheet` di kanan, dengan `Badge` counter kalau `totalItems > 0`

### B. Search Bar — `src/components/SearchBar.jsx`

- `<Input />` dengan icon `Search` di kiri, tombol `X` di kanan saat terisi
- `className="pl-6 pr-6"` — `Input` base-sera memakai `px-0`, ikon butuh ruang
- Placeholder: `"Cari produk, kategori..."`
- Filter mencakup `title`, `category`, dan `brand`

### C. Card Produk — `src/components/ProductCard.jsx`

- `<Card />` + `<Badge />` + `<Button />`
- Gambar: `aspect-square`, `object-contain p-4`, `fill` + `sizes`, hover `scale-105`
- Badge "Baru" muncul kalau `product.isNew`
- Meta: `category · brand` dalam `text-xs uppercase tracking-widest text-muted-foreground`
- Judul: `line-clamp-2 normal-case tracking-normal`
- Harga: `discountedPrice || price`, `oldPrice` dicoret kalau lebih besar
- Rating: icon `Star` + angka
- Tombol: `Tambah` dengan icon `Plus`

### D. Keranjang — `src/components/CartSheet.jsx`

- `<Sheet side="right">` dari Base UI. **Trigger pakai prop `render={...}`, bukan
  `asChild`** — itu perbedaan API Base UI vs Radix.
- Header: judul + `{totalItems} item di keranjang`
- Item: thumbnail 64px, judul clamp 2 baris, harga satuan, kontrol kuantitas
- Kontrol: `Minus`, angka, `Plus`, `Trash2`
- `Minus` di quantity 1 **menghapus item** — ditangani di `CartContext`
- Footer sticky: subtotal + tombol `Checkout` (disabled, di luar scope) +
  `Kosongkan keranjang`
- Empty state: pesan "Keranjang kosong"

### E. Loading & Error

- `src/app/store/loading.jsx` — 8 skeleton card (`aspect-square` + 2 baris teks).
  Komponen `Skeleton` presentational, tanpa `"use client"`.
- `src/app/store/error.jsx` — `"use client"` wajib. Menerima `{ error, reset }`.
  `reset()` menggantikan `window.location.reload()`.

---

## 5. Grid Responsif

| Breakpoint | Class |
| :-- | :-- |
| Mobile (`< 640px`) | `grid-cols-1` |
| Tablet (`≥ 640px`) | `sm:grid-cols-2` |
| Desktop (`≥ 1024px`) | `lg:grid-cols-4` |
| Gap | `gap-4 md:gap-6` |

---

## 6. Pola Reusable

### 6.1 Badge counter

```jsx
{totalItems > 0 && (
  <Badge className="absolute -right-2 -top-2 tabular-nums" aria-hidden="true">
    {totalItems}
  </Badge>
)}
```

`aria-hidden` — angka sudah tersampaikan lewat `sr-only` "Buka keranjang".

### 6.2 Format harga

```js
function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}
```

`Number()` wajib: `oldPrice` dari API datang sebagai string, `price` sebagai number.

### 6.3 Link sebagai tombol

Untuk navigasi internal, bungkus `<Button>` dengan `<Link>`:

```jsx
<Link href="/store" className="w-full">
  <Button className="w-full">Buka</Button>
</Link>
```

Jangan pakai `<a href>` — memicu full page reload dan membuang state client.

---

## 7. Aksesibilitas

- Ikon dekoratif: `aria-hidden="true"`
- Tombol icon-only: wajib `aria-label` (mis. `aria-label="Hapus dari keranjang"`)
- Input search: `aria-label="Cari produk"`
- `<nav>` diberi `aria-label="Navigasi utama"`
- Judul `<h1>` satu per halaman
````

Perhatikan tanda koma yang hilang pada blok kode di atas — baca baris aslinya dari file
sebelum menyalin, jangan memakai pola ini secara harfiah.

- [ ] **Step 4: Perbarui `README.md`**

Ganti seluruh isi dengan:

````markdown
# Softdev Hacker Project

Latihan Next.js dari UKM Softdev. Repository ini berisi kumpulan tugas mingguan.

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain:

```bash
npm run build   # build produksi
npm run lint    # ESLint
```

Butuh Node.js 20.18.1+. (Next.js 16 mensyaratkan 20.9+, tapi shadcn CLI 4.x mensyaratkan
20.18.1+ — yang lebih tinggi yang berlaku.)

## Halaman

| Route | Keterangan |
| :-- | :-- |
| `/` | Landing page, tautan ke semua halaman |
| `/store` | Katalog produk + pencarian + keranjang (tugas minggu ini) |
| `/diriku` | Kartu profil (minggu sebelumnya) |
| `/mahasiswa` | CRUD mahasiswa + pencarian (minggu sebelumnya) |

## Dokumentasi

| File | Isi |
| :-- | :-- |
| `AGENTS.md` | Konvensi kode dan batasan teknologi |
| `Architecture.md` | Struktur directory, state management, alur data |
| `DESIGN.md` | Design system, spesifikasi komponen, aksesibilitas |

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- JavaScript / JSX
- Tailwind CSS 4
- shadcn/ui style `base-sera` (Base UI primitives)
- lucide-react

Data produk dari [Fake Store API](https://fakestoreapi.noksha.dev).
````

- [ ] **Step 5: Verifikasi tidak ada referensi file lama tertinggal**

```bash
Select-String -Path *.md -Pattern "Architechture|reactbd|app/page\.js|Geist|Radix"
```

Expected: hanya `AGENTS.md` yang menyebut "Radix", itu dalam konteks koreksi
("bukan Radix"). Semua sisanya harus bersih.

- [ ] **Step 6: Commit**

```bash
git add AGENTS.md DESIGN.md README.md Architecture.md
git commit -m "docs: perbarui arsitektur, design system, dan README sesuai kondisi aktual"
```

---

## Task 16: Verifikasi akhir

**Files:** tidak ada yang dibuat atau dimodifikasi.

**Interfaces:**
- Consumes: seluruh hasil Task 1–15
- Produces: konfirmasi bahwa semua deliverable bekerja

- [ ] **Step 1: Lint dan build bersih**

```bash
npm run lint
npm run build
```

Expected: keduanya sukses tanpa error.

Kalau `npm run lint` gagal dengan error plugin atau config ESLint, periksa dulu apakah
file-nya milik kita. `eslint-config-next@16.3.5` sudah dipulihkan sebelum eksekusi plan,
jadi kegagalan lint hampir pasti berasal dari kode yang baru ditulis.

- [ ] **Step 2: Cek halaman lama tidak rusak**

```bash
npm run dev
```

Buka `/diriku` — kartu bio dengan gambar Unsplash harus tampil (kalau tidak, `Task 2`
tidak boleh menghapus `images.unsplash.com`).

- [ ] **Step 3: Cek `/mahasiswa` masih bekerja**

Tambah, hapus, dan cari mahasiswa. Hapus saat search aktif harus menghapus orang yang
benar (Task 13 Step 5 sudah memverifikasi ini, tapi cek ulang setelah semua perubahan).

- [ ] **Step 4: Cek alur `/store` end-to-end**

1. Buka `/store` — 30 produk tampil, **gambar termuat** (bukan 400 / broken icon).
   Ini verifikasi `remotePatterns` `Task 2` dan spec §9.2.
2. Saat load, skeleton muncul dulu.
3. Ketik `jacket` di search — grid menyaring real-time.
4. Ketik `zzzz` — empty state "Produk tidak ditemukan" muncul.
5. Klik tombol clear `X` — semua produk kembali.
6. Tambah 2 produk ke cart — badge counter menunjukkan 2.
7. Buka CartSheet — 2 item, subtotal benar.
8. `Plus` satu item — badge jadi 3, subtotal naik.
9. `Minus` sampai quantity 1 lalu `Minus` lagi — item hilang dari sheet, badge jadi 2.
10. `Trash2` — item terhapus, badge jadi 1.
11. **Refresh browser** — cart **masih ada** (verifikasi guard `hydrated`).
12. `Kosongkan keranjang` — badge jadi 0, sheet menampilkan empty state.
13. Buka DevTools → Console — **tidak ada** hydration mismatch warning.

- [ ] **Step 5: Cek `/`**

Buka `/` — 3 card, semua link berfungsi ke `/store`, `/diriku`, `/mahasiswa`.

- [ ] **Step 6: Commit hasil verifikasi**

Kalau `npm run build` menghasilkan `.next/` yang ter-track, pastikan `.gitignore` sudah
menutupnya:

```bash
git status --short
```

Expected: hanya file yang memang kita ubah. Kalau `.next/` muncul, tambahkan ke
`.gitignore`.

```bash
git add .gitignore
git commit -m "chore: cegah .next agar tidak ter-track"
```

---

## Ringkasan Task

| # | Deliverable | Verifikasi |
| :-- | :-- | :-- |
| 1 | sheet, scroll-area, skeleton via shadcn CLI | `lint` + `build` |
| 2 | `remotePatterns` pexels | `build` |
| 3 | `SearchContext` | `lint` |
| 4 | `CartContext` + localStorage | `lint` |
| 5 | `store/layout.jsx` provider | `lint` |
| 6 | `SearchBar` | `lint` |
| 7 | `ProductCard` | `lint` |
| 8 | `ProductGrid` | `lint` |
| 9 | `CartSheet` | `lint` |
| 10 | `Navbar` | `lint` |
| 11 | `page.jsx` + `loading.jsx` + `error.jsx` | `build` |
| 12 | Landing `/` | `build` |
| 13 | Fix bug mahasiswa | manual browser |
| 14 | Rapi `layout.jsx` | `build` |
| 15 | 4 dokumen | grep |
| 16 | Verifikasi end-to-end | manual browser |

Semua task bisa di-review terpisah. Task 13, 14, 15 berdiri sendiri dan tidak
bergantung pada task e-commerce — bisa dikerjakan lebih dulu kalau lebih suka
memperbaiki hal teknis sebelum menambah fitur.
