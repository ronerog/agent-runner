import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wedding Platform',
  description: 'Create your dream wedding website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-warm-50 text-slate-800">
        {children}
      </body>
    </html>
  )
}
