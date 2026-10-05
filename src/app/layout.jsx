import { Playfair_Display, Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const PlayfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Softdev Hacker Project Training",
  description: "A simple Next.js project for training purposes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        PlayfairDisplay.className,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
