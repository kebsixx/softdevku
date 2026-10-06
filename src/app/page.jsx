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
                <Icon
                  aria-hidden="true"
                  className="size-6 text-muted-foreground"
                />
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
