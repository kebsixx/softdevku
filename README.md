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

Butuh Node.js 20.18.1+. (Next.js 16 mensyaratkan 20.9+, tapi shadcn CLI 4.x
mensyaratkan 20.18.1+ — yang lebih tinggi yang berlaku.)

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
