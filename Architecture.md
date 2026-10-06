# System Architecture & Data Flow

Dokumen ini menjelaskan struktur arsitektur, manajemen state, serta alur komunikasi
data pada aplikasi ini.

---

## 1. Overview Arsitektur

Aplikasi ini dikembangkan menggunakan **Next.js 16 (App Router)** dengan
_User-Side Fetching_ di Server Component dan state global via React Context.

```
+-------------------------------------------------------+
|                    Next.js App                        |
|                                                       |
|  src/app/layout.jsx  (root: fonts, global style)      |
|                                                       |
|  +-------------------------------------------------+  |
|  |            src/app/store/layout.jsx             |  |
|  |  +-------------------------------------------+  |  |
|  |  |               CartProvider                |  |  |
|  |  |  +-------------------------------------+  |  |  |
|  |  |  |             SearchProvider            |  |  |  |
|  |  |  |  +-------------------------------+  |  |  |  |
|  |  |  |  |     Navbar & CartSheet         |  |  |  |  |
|  |  |  |  +-------------------------------+  |  |  |  |
|  |  |  |            ProductGrid            |  |  |  |  |
|  |  |  |     (+ ProductCard components)    |  |  |  |  |
|  |  |  +-------------------------------------+  |  |  |
|  |  +-------------------------------------------+  |  |
|  +-------------------------------------------------+  |
+---------------------------|---------------------------+
                            |
                    (HTTP / REST API)
                            v
        https://fakestoreapi.noksha.dev/api/products
```

Provider hanya dipasang di `src/app/store/layout.jsx`, bukan di root. Halaman
`/diriku` dan `/mahasiswa` tidak memakai context keranjang, dan file mereka tidak
pernah disentuh oleh perubahan e-commerce.

---

## 2. Struktur Directory Proyek

```text
├── src/
│   ├── app/
│   │   ├── layout.jsx           # Root layout (fonts, global style, metadata)
│   │   ├── page.jsx             # Landing page (tautan ke semua halaman)
│   │   ├── globals.css          # Tailwind import, token tema oklch, mode gelap
│   │   ├── store/
│   │   │   ├── layout.jsx       # CartProvider + SearchProvider
│   │   │   ├── page.jsx         # Server Component, fetch produk ke API
│   │   │   ├── loading.jsx      # Skeleton grid saat fetch berjalan
│   │   │   └── error.jsx        # Error boundary + tombol retry
│   │   ├── diriku/
│   │   │   └── page.jsx         # Kartu profil (minggu sebelumnya)
│   │   └── mahasiswa/
│   │       └── page.jsx         # CRUD mahasiswa (minggu sebelumnya)
│   ├── components/
│   │   ├── ui/                  # Komponen shadcn (button, card, input, badge,
│   │   │                        #   sheet, scroll-area, skeleton)
│   │   ├── Navbar.jsx           # Header + SearchBar + trigger CartSheet
│   │   ├── SearchBar.jsx        # Input pencarian produk
│   │   ├── ProductCard.jsx      # Card item produk individual
│   │   ├── ProductGrid.jsx      # Grid container + filter + empty state
│   │   ├── CartSheet.jsx        # Drawer keranjang belanja
│   │   └── cardku.jsx           # Kartu mahasiswa (minggu sebelumnya)
│   ├── context/
│   │   ├── CartContext.jsx      # Global state keranjang + localStorage
│   │   └── SearchContext.jsx    # Global state query pencarian
│   └── lib/
│       └── utils.js             # Re-export `cn` dari package `cn`
├── public/                      # Aset statis
├── next.config.mjs              # remotePatterns untuk next/image
├── AGENTS.md                    # Konvensi kode & batasan teknologi
├── Architecture.md              # Dokumen ini
└── DESIGN.md                    # Design system & spesifikasi komponen
```

---

## 3. State Management Flow

### A. Cart State (`src/context/CartContext.jsx`)

- **State Data:** `cart` (Array of objects)
  - Struktur Object Item: `{ _id, title, price, image, category, quantity }`
- **Actions:**
  - `addToCart(product)`: Menambahkan item baru atau meningkatkan `quantity` jika
    produk sudah ada di keranjang.
  - `removeFromCart(productId)`: Menghapus item dari keranjang berdasarkan ID.
  - `updateQuantity(productId, type)`: Mengubah jumlah barang (`'inc'` atau `'dec'`).
    Saat `quantity` mencapai 0, item dihapus otomatis.
  - `clearCart()`: Mengosongkan isi keranjang.
- **Derived Values:**
  - `totalItems`: Total kuantitas barang dalam keranjang (untuk badge di Navbar).
  - `totalPrice`: Total nominal belanja (`SUM(price * quantity)`).
- **Persistensi:** state disimpan ke `localStorage` dengan key `softdevku-cart`.

Implementasi memakai `useSyncExternalStore` dengan `localStorage` sebagai external
store. Pendekatan `useState` + `useEffect` ditolak karena:

1. memicu error lint `react-hooks/set-state-in-effect`, dan
2. menyebabkan *cascading render* — effect restore menulis state, lalu effect simpan
   langsung menulis `[]` ke `localStorage` sebelum restore selesai, sehingga keranjang
   hilang permanen setelah refresh.

`useSyncExternalStore` memberi snapshot stabil di server (`EMPTY_CART`), jadi tidak
ada *hydration mismatch* dan tidak perlu guard `hydrated`.

### B. Search State (`src/context/SearchContext.jsx`)

- **State Data:** `searchQuery` (String)
- **Actions:** `setSearchQuery(query)`, `clearSearch()`
- **Penggunaan:** Memfilter daftar produk berdasarkan kecocokan `title`, `category`,
  atau `brand`. Berjalan di client, tanpa request baru ke server.

---

## 4. API Integration & Fetching Strategy

- **API Endpoint:** `https://fakestoreapi.noksha.dev/api/products?perPage=100`
- **Metode Fetching:** `fetch()` di **Server Component** (`src/app/store/page.jsx`).
  Hasilnya dikirim sebagai prop ke `ProductGrid` (Client Component) sehingga
  filtering berjalan di memori tanpa request ulang.
- **Penanganan Loading:** `src/app/store/loading.jsx` otomatis tampil selama `await`.
- **Penanganan Error:** `throw` pada response non-OK ditangkap
  `src/app/store/error.jsx`.

### Catatan penting soal endpoint

| Endpoint | Status |
| :-- | :-- |
| `fakestoreapi.noksha.dev` | **Aktif** — dipakai project ini |
| `fakestoreapi.reactbd.com` | Mati — mengembalikan HTML, bukan JSON |
| `fakestoreapi.in` | Mati — mengembalikan HTML |
| `fakestoreapi.com` | Mati — HTTP 521 |

Dua hal yang wajib diperhatikan:

1. **`?perPage=100` wajib.** Tanpa parameter itu API hanya mengirim 20 dari 30 produk
   dan reports `totalPages: 2`.
2. **Response dibungkus.** Bentuknya
   `{ data, totalProducts, totalPages, currentPage, perPage }`, jadi data produk
   diambil lewat `payload.data`, bukan langsung dari JSON.

### Gambar produk

Field `image` berisi URL `images.pexels.com`. Host ini **wajib** ada di
`remotePatterns` di `next.config.mjs`, kalau tidak setiap `<Image>` produk akan
mendapat HTTP 400. `images.unsplash.com` juga tetap dipakai oleh halaman `/diriku`.

---

## 5. Algoritma Filter Pencarian (Client-Side Search)

```javascript
const query = searchQuery.trim().toLowerCase();
if (!query) return products;

return products.filter(
  (product) =>
    product.title.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query) ||
    product.brand.toLowerCase().includes(query),
);
```

Filter ini jalan di dalam `useMemo` pada `src/components/ProductGrid.jsx`, jadi
tidak dijalankan ulang pada render yang tidak terkait pencarian.

---

## 6. Routing

| Route | Render | Keterangan |
| :-- | :-- | :-- |
| `/` | Server Component | Landing page, tautan ke 3 halaman |
| `/store` | Server + Client | Katalog produk, keranjang |
| `/diriku` | Server Component | Kartu profil |
| `/mahasiswa` | Client Component | CRUD mahasiswa + pencarian |

Navigasi antar halaman memakai `next/link`. `<a href>` internal tidak dipakai karena
men memicu full page reload dan membuang seluruh state client.