import { Geist_Mono, Noto_Sans } from "next/font/google";

import "@maricopa-senior-living/ui/globals.css";

import { cn } from "@maricopa-senior-living/ui/lib/utils";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        notoSans.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
