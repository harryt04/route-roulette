// RootLayout.js
import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import './globals.css'
import CustomThemeProvider from './CustomThemeProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://rr.harryt.dev'),
  title: 'Route Roulette',
  description:
    'Get a random scenic drive near you. Choose a search radius, shuffle nearby viewpoints, parks and attractions, then open the route in Google Maps.',
  alternates: { canonical: '/' },
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProduction = process.env.NODE_ENV === 'production'

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <CustomThemeProvider>{children}</CustomThemeProvider>
        </AppRouterCacheProvider>

        {isProduction && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
