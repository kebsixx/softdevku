"use client";

import { Plus, UserX } from "lucide-react";
import Cardku from "@/components/cardku";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [search, setSearch] = useState("");
  const [namaBaru, setNamaBaru] = useState("");

  const handleTambah = () => {
    const nama = namaBaru.trim();
    if (nama === "") return;

    // randomUUID hanya tersedia di secure context (https atau localhost).
    const id =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setMahasiswa([...mahasiswa, { id, nama }]);
    setNamaBaru("");
  };

  const mahasiswaFiltered = mahasiswa.filter((mhs) =>
    mhs.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const handleHapus = (id) => {
    setMahasiswa(mahasiswa.filter((mhs) => mhs.id !== id));
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-5">
        <h1 className="font-heading text-3xl uppercase tracking-widest">
          Daftar Mahasiswa
        </h1>
        <p className="text-sm tabular-nums text-muted-foreground">
          {mahasiswa.length} orang
        </p>
      </div>

      <div className="mb-3">
        <label htmlFor="cari-mahasiswa" className="sr-only">
          Cari mahasiswa
        </label>
        <Input
          id="cari-mahasiswa"
          type="search"
          placeholder="Cari mahasiswa..."
          value={search}
          className="focus-visible:border"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mb-8 flex gap-2">
        <div className="flex-1">
          <label htmlFor="nama-baru" className="sr-only">
            Nama mahasiswa yang ditambahkan
          </label>
          <Input
            id="nama-baru"
            type="text"
            placeholder="Tambah mahasiswa..."
            value={namaBaru}
            className="focus-visible:border"
            onChange={(e) => setNamaBaru(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleTambah();
            }}
          />
        </div>
        <Button onClick={handleTambah} className="shrink-0">
          <Plus aria-hidden="true" />
          Tambah
        </Button>
      </div>

      {mahasiswaFiltered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <UserX aria-hidden="true" className="size-10 text-muted-foreground" />
          <p className="font-heading text-lg uppercase tracking-wider">
            {mahasiswa.length === 0 ? "Belum ada mahasiswa" : "Tidak ada hasil"}
          </p>
          <p className="max-w-[34ch] text-sm text-muted-foreground">
            {mahasiswa.length === 0
              ? "Isi kolom di atas, lalu tekan Tambah."
              : `Tidak ada mahasiswa bernama "${search}".`}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {mahasiswaFiltered.map((mhs) => (
            <li key={mhs.id}>
              <Cardku name={mhs.nama} handleHapus={() => handleHapus(mhs.id)} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
