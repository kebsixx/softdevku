import { Button } from "@/components/ui/button";

export default function Cardku({ id, name, handleHapus }) {
  return (
    <div className="border p-4 bg-white dark:bg-gray-800 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>

      <Button
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={() => handleHapus(id)}>
        Hapus
      </Button>
    </div>
  );
}
