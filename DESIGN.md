# UI/UX Design System & Layout Specs

Dokumen ini mendeskripsikan panduan visual, tata letak antarmuka, dan spesifikasi
komponen. Acuan adalah style **`base-sera`** yang sudah terpasang di `components.json` —
bukan guideline generik.

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
  <Badge
    className="absolute -right-2 -top-2 tabular-nums"
    aria-hidden="true"
  >
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
