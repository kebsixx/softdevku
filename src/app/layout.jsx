import { Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Softdev Hacker Project Training",
  description: "A simple Next.js project for training purposes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={cn(
        "h-full antialiased font-sans",
        notoSans.variable,
        playfairDisplay.variable,
      )}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
