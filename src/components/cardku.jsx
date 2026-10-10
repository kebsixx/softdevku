import { Button } from "@/components/ui/button";

export default function Cardku({ name, handleHapus }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border bg-card px-4 py-3">
      <h2 className="min-w-0 truncate text-sm font-medium">{name}</h2>

      <Button
        variant="destructive"
        size="xs"
        onClick={handleHapus}
        className="shrink-0">
        Hapus
      </Button>
    </div>
  );
}
