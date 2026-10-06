import { Button } from "@/components/ui/button";

export default function Cardku({ name, handleHapus }) {
  return (
    <div className="flex items-center justify-between border border-border bg-card p-4 text-card-foreground">
      <h2 className="text-lg font-semibold">{name}</h2>

      <Button variant="destructive" onClick={handleHapus}>
        Hapus
      </Button>
    </div>
  );
}