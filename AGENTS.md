# Agents & Developer Guidelines

Dokumen ini menjadi acuan panduan bagi AI Agent maupun developer yang akan berkontribusi dalam pengembangan aplikasi E-Commerce sederhana ini.

---

## 1. Peran & Responsibility

AI Agent / Developer bertugas sebagai **Frontend Developer** yang fokus membangun UI/UX responsif, integrasi data fetching dari API, serta mengelola global state sederhana (Cart dan Search).

---

## 2. Batasan Teknologi (Tech Stack Constraints)

Seluruh instruksi pengembangan Wajib mengikuti aturan berikut:

- **Framework:** Next.js (App Router)
- **Bahasa:** JavaScript (JS / JSX). **JANGAN gunakan TypeScript** (`.ts` / `.tsx`).
- **Styling:** Tailwind CSS (Utility classes)
- **UI Components:** shadcn/ui (berbasis Tailwind & Radix primitives)
- **Icons:** `lucide-react`
- **State Management:** React Context API (Cart Context & Search Context)
- **Data Source:** `https://fakestoreapi.reactbd.com/products` (atau endpoint turunan seperti `/products`)

---

## 3. Cakupan Fitur (Project Scope)

Pengembangan saat ini diprioritaskan hanya pada 3 modul utama:

1. **Fetching Data Product:**
   - Mengambil data produk dari Fake Store API.
   - Menampilkan status _loading_ (Skeleton) dan penanganan _error_.
2. **Search / Pencarian Produk:**
   - Fitur filter pencarian _real-time_ berbasis nama produk/kategori di sisi client.
3. **Cart Management (State Add to Cart):**
   - Menambahkan produk ke keranjang.
   - Mengubah jumlah (_quantity_) item dalam keranjang.
   - Menghapus item dari keranjang.
   - Menghitung total harga dan jumlah barang secara _real-time_.

---

## 4. Konvensi Penulisan Kode (Coding Conventions)

### A. Struktur File & Penamaan

- Gunakan ekstensi `.js` atau `.jsx` untuk semua file React/Next.js.
- Penamaan komponen menggunakan **PascalCase** (contoh: `ProductCard.jsx`, `Navbar.jsx`).
- Penamaan helper/context/hook menggunakan **camelCase** (contoh: `useCart.js`, `cartContext.js`).

### B. Komponen & Formatting

- Gunakan Functional Components dengan React Hooks.
- Gunakan kustom komponen shadcn/ui dari `@/components/ui/` (seperti `Button`, `Input`, `Badge`, `Sheet`, `Card`).
- Gunakan icon dari `lucide-react` (contoh: `<ShoppingCart />`, `<Search />`, `<Plus />`, `<Minus />`, `<Trash2 />`).

### C. Pola React Context

Setiap perubahan pada keranjang harus dipusatkan melalui `CartContext` agar dapat diakses dari komponen mana saja (Navbar badge counter, Cart drawer, Product Card button).

---

## 5. Panduan Prompting untuk Agent

Saat meminta perbaikan atau penambahan fitur ke AI Agent, pastikan menyertakan konteks berikut:

```text
"Tolong buatkan [nama fitur] menggunakan Next.js JavaScript (.jsx), Tailwind CSS, dan shadcn/ui. Gunakan Lucide React untuk icon dan sesuaikan dengan CartContext yang sudah ada."
```
