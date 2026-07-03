import { cn } from "@maricopa-senior-living/ui/lib/utils";
import { Geist, Geist_Mono } from "next/font/google";

import "@maricopa-senior-living/ui/globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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
        geist.variable,
      )}
    >
      <body>{children}</body>
    </html>
  );
}
