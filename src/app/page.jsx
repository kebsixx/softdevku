import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 ">
      <h1 className="text-3xl font-bold">Welcome to My App</h1>
      <p className="text-gray-600">This is a simple home page.</p>

      <a href="/diriku">
        <Button className="mt-4">Go to Diriku Page</Button>
      </a>
      <a href="/mahasiswa">
        <Button className="mt-4">Go to Mahasiswa Page</Button>
      </a>
    </div>
  );
}
