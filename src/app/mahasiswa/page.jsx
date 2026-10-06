"use client";

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

    setMahasiswa([...mahasiswa, { id: crypto.randomUUID(), nama }]);
    setNamaBaru("");
  };

  const mahasiswaFiltered = mahasiswa.filter((mhs) =>
    mhs.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const handleHapus = (id) => {
    setMahasiswa(mahasiswa.filter((mhs) => mhs.id !== id));
  };

  return (
    <div className="min-w-xl p-8 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Daftar Mahasiswa</h1>
      <div className="mb-5">
        <Input
          type="text"
          placeholder="Cari mahasiswa..."
          value={search}
          className="focus-visible:ring-0 focus:visible:border"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-5">
        <Input
          type="text"
          placeholder="Tambah mahasiswa..."
          value={namaBaru}
          className="focus-visible:ring-0 focus:visible:border"
          onChange={(e) => setNamaBaru(e.target.value)}
        />
        <Button onClick={handleTambah}>Tambah</Button>
      </div>

      <div className="space-y-4 mb-5">
        {mahasiswaFiltered.map((mhs) => (
          <Cardku
            key={mhs.id}
            id={mhs.id}
            name={mhs.nama}
            handleHapus={() => handleHapus(mhs.id)}
          />
        ))}
      </div>
    </div>
  );
}
