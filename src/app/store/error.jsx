"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StoreError({ error, reset }) {
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
