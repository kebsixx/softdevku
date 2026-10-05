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
    if (namaBaru.trim() === "") return;

    setMahasiswa([...mahasiswa, { nama: namaBaru }]);
    setNamaBaru("");
  };

  const mahasiswaFiltered = mahasiswa.filter((mhs) =>
    mhs.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const handleHapus = (index) => {
    const updatedMahasiswa = [...mahasiswa];
    updatedMahasiswa.splice(index, 1);
    setMahasiswa(updatedMahasiswa);
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
        {mahasiswaFiltered.map((mhs, index) => (
          <Cardku
            key={index}
            name={mhs.nama}
            handleHapus={() => handleHapus(index)}
          />
        ))}
      </div>
    </div>
  );
}
