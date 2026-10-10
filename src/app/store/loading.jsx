import { Skeleton } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-end justify-between gap-6 border-b border-border pb-5">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex h-full flex-col gap-5 bg-card p-5 ring-1 ring-foreground/15">
            <Skeleton className="aspect-square w-full" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="mt-auto flex items-end justify-between gap-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
