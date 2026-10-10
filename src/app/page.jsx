import Link from "next/link";
import { ArrowRight, GraduationCap, ShoppingBag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAGES = [
  {
    href: "/store",
    icon: ShoppingBag,
    title: "StoreDev",
    description:
      "Katalog produk dengan pencarian real-time dan keranjang belanja.",
    tag: "Tugas minggu ini",
  },
  {
    href: "/diriku",
    icon: User,
    title: "Diriku",
    description: "Kartu profil singkat.",
    tag: null,
  },
  {
    href: "/mahasiswa",
    icon: GraduationCap,
    title: "Mahasiswa",
    description: "Daftar mahasiswa dengan tambah, hapus, dan pencarian.",
    tag: null,
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-4 py-16">
      <header className="border-b border-border pb-8">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          UKM Softdev
        </p>
        <h1 className="mt-3 font-heading text-4xl uppercase tracking-widest text-balance">
          Softdev Hacker Project
        </h1>
        <p className="mt-4 max-w-[52ch] text-muted-foreground">
          Tiga latihan mingguan. Pilih salah satu untuk mulai.
        </p>
      </header>

      <ul className="divide-y divide-border">
        {PAGES.map((page) => {
          const Icon = page.icon;

          return (
            <li key={page.href}>
              <Link
                href={page.href}
                className="group flex items-center gap-4 py-5 sm:gap-5">
                <Icon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-muted-foreground"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="font-heading text-lg uppercase tracking-widest group-hover:underline">
                      {page.title}
                    </h2>
                    {page.tag && <Badge variant="secondary">{page.tag}</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {page.description}
                  </p>
                </div>

                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
