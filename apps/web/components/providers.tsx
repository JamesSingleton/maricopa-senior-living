'use client'
import PlausibleProvider from 'next-plausible'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <PlausibleProvider domain="maricopaseniorliving.org">{children}</PlausibleProvider>
    </NextThemesProvider>
  )
}
