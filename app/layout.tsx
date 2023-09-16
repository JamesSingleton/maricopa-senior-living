import 'tailwindcss/tailwind.css'

import { Inter, Roboto_Mono } from 'next/font/google'
import PlausibleProvider from 'next-plausible'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const roboto_mono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
})


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${roboto_mono.variable}`}>
      <head>
        <PlausibleProvider domain="maricopaseniorliving.org" trackFileDownloads trackOutboundLinks />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
