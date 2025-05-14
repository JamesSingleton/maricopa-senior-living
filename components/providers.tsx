'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import PlausibleProvider from 'next-plausible'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlausibleProvider domain="maricopaseniorliving.org" trackFileDownloads trackOutboundLinks>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </PlausibleProvider>
  )
}
