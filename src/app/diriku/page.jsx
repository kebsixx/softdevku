import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";

function CardImage() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <Image
        src="https://images.unsplash.com/photo-1654110455429-cf322b40a906"
        alt="Event cover"
        width={640}
        height={360}
        className="aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardContent className="flex flex-col gap-4">
        <h1 className="font-heading text-lg font-semibold uppercase tracking-wider">
          Hi, I Rizieq
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A Developer who loves to create beautiful and functional web
          applications. I specialize in front-end development and have a passion
          for learning new technologies.
        </p>
        <Button render={<Link href="/" />} className="w-full">
          Kembali ke Beranda
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Diriku() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      <CardImage />
    </main>
  );
}
