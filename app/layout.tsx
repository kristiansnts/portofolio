import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter_Tight } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { LanguageProvider } from '@/lib/language-context'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  title: 'Kristian Santoso - Personal Website',
  description:
    'Software Engineer, Manager at Science Society Branch Ngawi, and a Person In Control of LevelUP Branch Ngawi',
}

const interTight = Inter_Tight({
  variable: '--font-inter-tight',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interTight.variable} ${geistMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950`}
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
        >
          <LanguageProvider>
            <div className="flex min-h-screen w-full flex-col font-[family-name:var(--font-inter-tight)]">
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
