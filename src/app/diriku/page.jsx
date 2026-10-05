import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Image from "next/image";

function CardImage() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <Image
        src="https://images.unsplash.com/photo-1654110455429-cf322b40a906"
        alt="Event cover"
        width={640}
        height={360}
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>Hi, I Rizieq</CardTitle>
        <CardDescription>
          A Developer who loves to create beautiful and functional web
          applications. I specialize in front-end development and have a passion
          for learning new technologies.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Learn More</Button>
      </CardFooter>
    </Card>
  );
}

export default function Diriku() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <CardImage />
    </div>
  );
}
