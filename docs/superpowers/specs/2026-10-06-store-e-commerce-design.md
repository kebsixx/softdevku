# Design Spec: Halaman E-Commerce `/store`

Tanggal: 2026-10-06
Status: Menunggu review — belum ada implementasi

---

## 1. Tujuan

Membangun halaman e-commerce (tugas minggu ini) sesuai `AGENTS.md`, tanpa menghapus
atau merusak hasil percobaan minggu sebelumnya (`/diriku`, `/mahasiswa`).

Home page (`/`) menjadi landing page yang menautkan ketiga halaman.

---

## 2. Realitas Project (diverifikasi)

Doc yang ada (`AGENTS.md`, `Architechture.md`, `DESIGN.md`) sebagian tidak cocok dengan
kode. Fakta di bawah diverifikasi langsung terhadap `node_modules` dan API.

### 2.1 Stack aktual

| Hal | Nilai aktual | Sumber |
| :-- | :-- | :-- |
| Next.js | `16.3.8` | `node_modules/next/package.json` |
| React | `19.2.8` | `package.json` |
| Bundler | Turbopack (default Next 16) | `docs/.../upgrading/version-16.md` |
| UI primitives | `@base-ui/react@1.8.0` — **bukan Radix** | `package.json` |
| shadcn CLI | `shadcn@1.0.0`, style `base-sera` | `components.json` |
| Class merge | `cn@0.3.2` (pkg resmi shadcn-ui/cn) | `node_modules/cn/package.json` |
| Tema | oklch `baseColor: "taupe"` | `components.json`, `globals.css` |

`AGENTS.md` §2 menyebut "shadcn/ui (berbasis Tailwind & **Radix** primitives)". Salah —
tidak ada satu pun dependensi Radix di tree.

### 2.2 Bahasa visual base-sera

Dari `src/components/ui/*.jsx` + `globals.css`:

- `rounded-none` di semua komponen
- `uppercase tracking-widest` pada Button dan CardTitle
- `font-heading` → Playfair Display; body → Noto Sans
- Palet taupe oklch (`--primary: oklch(0.214 0.009 43.1)`), bukan slate

`DESIGN.md` §1–§2 mendeskripsikan slate/emerald/rose + rounded + Inter/Geist. Tidak
cocok dengan kode. **Keputusan: base-sera yang menang, `DESIGN.md` ditulis ulang.**

### 2.3 API

Endpoint di `AGENTS.md` (`https://fakestoreapi.reactbd.com/products`) **mati**.
Diverifikasi 2026-10-06:

| URL | Hasil |
| :-- | :-- |
| `fakestoreapi.reactbd.com/products` | HTTP 200 tapi `text/html` (halaman marketing) |
| `fakestoreapi.in/api/products` | HTTP 200 tapi `text/html` |
| `fakestoreapi.com/products` | HTTP 521 |

Endpoint yang dipakai (dari user, diverifikasi jalan):

```
https://fakestoreapi.noksha.dev/api/products?perPage=100
```

Respons **dibungkus dan berpaginasi**:

```json
{
  "data": [ /* 30 item */ ],
  "totalProducts": 30,
  "totalPages": 2,
  "currentPage": 1,
  "perPage": 20
}
```

Shape item (melebihi field yang dibutuhkan `Architecture.md`):

```
_id, title, isNew, oldPrice, price, discountedPrice, description,
category, type, stock, brand, size, image, rating
```

Contoh item:

```json
{
  "_id": 1,
  "title": "Long sleeve Jacket",
  "isNew": true,
  "oldPrice": "200",
  "price": 150,
  "discountedPrice": 135,
  "category": "women",
  "type": "jacket",
  "stock": 50,
  "brand": "FashionTrend",
  "size": ["S", "M", "L"],
  "image": "https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg",
  "rating": 4
}
```

**`?perPage=100` wajib.** Tanpa itu hanya 20 item terkirim dan `totalPages: 2` —
10 produk hilang.

Gambar berasal dari `images.pexels.com`, yang **belum ada** di `next.config.mjs`
`remotePatterns`. Tanpa itu, setiap `<Image>` produk kena HTTP 400.

---

## 3. Arsitektur & Route

```
src/app/
├── page.jsx                 # Landing: link ke /store, /diriku, /mahasiswa
├── store/
│   ├── layout.jsx           # CartProvider + SearchProvider
│   ├── page.jsx             # Server Component, fetch produk
│   ├── loading.jsx          # Skeleton grid
│   └── error.jsx            # Error boundary + retry
├── diriku/                  # MINGGU LAMA — tidak disentuh
├── mahasiswa/               # MINGGU LAMA — bug diperbaiki, file tetap
├── layout.jsx               # Fix duplikat Playfair_Display
└── globals.css

src/context/
├── CartContext.jsx
└── SearchContext.jsx

src/components/
├── Navbar.jsx
├── SearchBar.jsx
├── ProductGrid.jsx          # client, filter via SearchContext
├── ProductCard.jsx
└── CartSheet.jsx
```

**Provider di `store/layout.jsx`, bukan root.** Konsekuensi: `/diriku` dan
`/mahasiswa` tidak tersentuh sama sekali oleh provider — tidak ada `"use client"`
yang merambat ke halaman lama, dan `src/app/layout.jsx` yang mereka pakai tetap utuh
kecuali perbaikan font di §7.

---

## 4. Data Flow

```
Server Component (store/page.jsx)
  └─ fetch ?perPage=100  → 30 produk
       └─ props → <ProductGrid products>   ("use client")
            ├─ useSearchContext()  → filter real-time
            └─ useCartContext()    → addToCart
```

`ProductGrid` jadi batas server/client. Products datang sebagai prop, tidak di-fetch
ulang di browser — search hanya memfilter array di memori.

**Error handling:**

```jsx
const res = await fetch("https://fakestoreapi.noksha.dev/api/products?perPage=100");
if (!res.ok) throw new Error(`Fake Store API error: ${res.status}`);
const { data } = await res.json();
```

`throw` di Server Component otomatis ditangkap `store/error.jsx`. `loading.jsx`
mengambil alih selama `await`. Tidak perlu state loading manual.

---

## 5. Cart Context

### 5.1 State & actions

Item: `{ _id, title, price, image, category, quantity }` (mengikuti `Architechture.md` §3A)

- `addToCart(product)` — tambah, atau naikkan `quantity` bila `_id` sudah ada
- `removeFromCart(productId)`
- `updateQuantity(productId, type)` — `type` `'inc'` | `'dec'`
- `clearCart()`
- Derived: `totalItems` (sum quantity), `totalPrice` (sum price × quantity)

### 5.2 Persistensi localStorage

Initial state selalu `[]`, baca di `useEffect`. Butuh guard `hydrated` — tanpa itu
effect kedua menimpa `localStorage` dengan `[]` sebelum restore selesai, dan cart
hilang permanen:

```jsx
const [cart, setCart] = useState([]);
const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  try {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  } catch {
    // data rusak di DevTools — abaikan, mulai dari cart kosong
  }
  setHydrated(true);
}, []);

useEffect(() => {
  if (hydrated) localStorage.setItem("cart", JSON.stringify(cart));
}, [cart, hydrated]);
```

`try/catch` menutup risiko `JSON.parse` throw → white screen. 3 baris.

Tidak pakai `useSyncExternalStore`: lebih banyak kode untuk hasil identik.

---

## 6. UI Components

### 6.1 Komponen baru via shadcn CLI

`npx shadcn@latest add sheet scroll-area skeleton`

Terverifikasi: ketiga registry `https://ui.shadcn.com/r/styles/base-sera/*.json`
return HTTP 200. `sheet.json` hanya butuh dependency `cn` — **sudah terpasang**.
Tidak ada dependensi baru.

### 6.2 Komponen aplikasi

| Komponen | shadcn | base-sera yang dipakai |
| :-- | :-- | :-- |
| `Navbar.jsx` | Button, Input, Badge | sticky, `bg-background/80 backdrop-blur`, border-b |
| `SearchBar.jsx` | Input | icon `Search`, tombol clear `X` |
| `ProductCard.jsx` | Card, Badge, Button | `font-heading` title, `line-clamp-2`, image `object-contain aspect-square` |
| `ProductGrid.jsx` | Card | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6` |
| `CartSheet.jsx` | Sheet, ScrollArea, Button, Badge | footer sticky, `totalPrice` |

Icon dari `lucide-react`: `ShoppingBag`, `ShoppingCart`, `Search`, `X`, `Plus`,
`Minus`, `Trash2`.

### 6.3 Pakai field API tambahan

`isNew` dan `discountedPrice` sudah ada di response, dan `Badge` sudah terpasang di
`components/ui/badge.jsx`. Menambahkannya cuma 2 baris: Badge "NEW" di pojok card dan
harga coret di samping `price`.

---

## 7. Perbaikan pada file existing

### 7.1 `next.config.mjs`
Tambah `images.pexels.com` ke `remotePatterns` (wajib, tanpa ini gambar 400).

### 7.2 `src/app/page.jsx`
Landing page, 3 link. Ganti `<a href>` dengan `<Link>` — `<a>` menyebabkan full reload
ke home. Body English ("Welcome to My App") diganti Bahasa Indonesia.

### 7.3 `src/app/layout.jsx`
`Playfair_Display` di-instansiasi dua kali (line 5 `playfairDisplayHeading` dan
line 12 `PlayfairDisplay`). Font heading praktis mati: `.className` dan `font-sans`
diletakkan di elemen `<html>` yang sama, dan tidak ada `font-heading` dipakai di
mana pun. Rapikan ke satu instansi.

### 7.4 `src/app/mahasiswa/page.jsx`

Bug: `handleHapus(index)` menerima index dari `mahasiswaFiltered`, lalu `splice`
ke array `mahasiswa`. **Hapus mahasiswa yang salah setiap kali search aktif.**

Perbaikan: beri setiap item `id` saat dibuat, lalu hapus berdasarkan `id` dan bukan
index. `Cardku` menerima `id` sebagai prop baru — file `cardku.jsx` ikut berubah
sedikit, tapi isinya (tampilan) tidak.

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

`key={index}` → `key={mhs.id}`.

`crypto.randomUUID()` tersedia di browser modern tanpa import. `filter` menggantikan
`splice` — tanpa mutasi array.

Alternatif yang ditolak: memakai `nama` sebagai identitas. Dua mahasiswa boleh punya
nama sama, lalu satu tidak terhapus. `id` menambah 1 baris dan menutup bug itu.

Tampilan tidak berubah, file tetap ada.

### 7.5 Dokumen

| File | Aksi |
| :-- | :-- |
| `Architechture.md` | **Rename** → `Architecture.md` (typo). Update §2 (prefix `src/`, ext `.jsx`), §4 (endpoint, Server Component), tambah route `/store`. |
| `DESIGN.md` | **Rewrite** ke base-sera aktual: taupe oklch, rounded-none, uppercase tracking-widest, Playfair + Noto Sans. Tambah spec `/store`. |
| `AGENTS.md` | Endpoint → `fakestoreapi.noksha.dev` + `?perPage=100`. "Radix" → Base UI. Tambah poin persistensi localStorage. |
| `README.md` | Ganti boilerplate create-next-app: path `src/app/`, font Playfair/Noto (bukan Geist), daftar route. |

### 7.6 Tidak disentuh

`src/app/diriku/page.jsx` — biodata card, minggu lalu.

`src/components/cardku.jsx` — **tampilan tidak diubah**. Hanya satu prop baru (`id`)
diteruskan ke `onClick`. Lihat §7.4.

---

## 8. Verifikasi

Project tidak punya test framework, dan tidak akan ditambah (di luar scope).

- `npm run lint`
- `npm run build`
- Manual via browser: produk load, skeleton muncul, search filter real-time,
  add / inc / dec / remove, badge counter benar, refresh tidak loses cart,
  `/diriku` dan `/mahasiswa` masih berfungsi, hapus mahasiswa benar saat search aktif.

---

## 9. Risiko Belum Terverifikasi

1. **`shadcn@1.0.0` CLI vs style `base-sera`** — registry 200 OK, tapi CLI bisa
   meminta konfirmasi interaktif yang tidak bisa dijawab dari CLI non-interaktif.
   *Mitigasi: jalankan satu komponen dulu, cek hasilnya sebelum menambah yang lain.*
2. **`remotePatterns` di Turbopack Next 16** — pola `remotePatterns` sudah lama
   stabil, tapi perlu konfirmasi nyata bahwa `images.pexels.com` ter-apply.
3. **`eslint-config-next@^14.2.35` vs `next@^16.3.8`** — major beda 3, kemungkinan
   `npm run lint` sudah rusak **sebelum** perubahan kita. Di luar scope tugas ini,
   tapi hasil lint tidak boleh dianggap bersih tanpa dicek.

---

## 10. Di luar Scope

- Checkout / payment
- Persistensi produk atau auth
- Pagination UI (`?perPage=100` membuat 30 produk cukup satu halaman)
- Test framework
- Perbaikan `eslint-config-next` (lihat 9.3)
- Menambah `clsx`/`tailwind-merge` — `cn` sudah setara
