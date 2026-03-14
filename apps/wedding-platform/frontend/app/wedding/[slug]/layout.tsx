import React from 'react'
import Link from 'next/link'
import { weddings } from '../../../lib/api'
import type { WeddingData } from '../../../lib/api'

interface Props {
  children: React.ReactNode
  params: { slug: string }
}

async function getWedding(slug: string): Promise<WeddingData | null> {
  try {
    const data = await weddings.getBySlug(slug)
    return data
  } catch {
    return null
  }
}

export default async function WeddingLayout({ children, params }: Props) {
  const wedding = await getWedding(params.slug)

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <h1 className="font-serif text-4xl text-slate-700 mb-4">Site Not Found</h1>
          <p className="text-slate-500">This wedding site does not exist.</p>
        </div>
      </div>
    )
  }

  if (!wedding.is_published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <div className="text-5xl mb-4">💍</div>
          <h1 className="font-serif text-3xl text-slate-700 mb-3">Coming Soon</h1>
          <p className="text-slate-500">
            {wedding.bride_name} &amp; {wedding.groom_name}&apos;s wedding site is not yet available.
          </p>
        </div>
      </div>
    )
  }

  const slug = params.slug

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/wedding/${slug}`} className="font-serif text-xl font-semibold text-slate-800">
            {wedding.bride_name} &amp; {wedding.groom_name}
          </Link>
          <div className="flex items-center gap-6">
            <Link href={`/wedding/${slug}`} className="text-sm text-slate-600 hover:text-rose-500 transition-colors">Home</Link>
            <Link href={`/wedding/${slug}/evento`} className="text-sm text-slate-600 hover:text-rose-500 transition-colors">Event</Link>
            <Link href={`/wedding/${slug}/galeria`} className="text-sm text-slate-600 hover:text-rose-500 transition-colors">Gallery</Link>
            <Link href={`/wedding/${slug}/presentes`} className="text-sm text-slate-600 hover:text-rose-500 transition-colors">Gifts</Link>
            <Link
              href={`/wedding/${slug}/rsvp`}
              className="bg-rose-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors"
            >
              RSVP
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content — padded for fixed nav */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 mt-16">
        <p className="font-serif text-white text-lg mb-1">
          {wedding.bride_name} &amp; {wedding.groom_name}
        </p>
        {wedding.wedding_date && (
          <p className="text-sm">
            {new Date(wedding.wedding_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
        <p className="text-xs mt-4 text-slate-600">Made with Wedding Platform</p>
      </footer>
    </div>
  )
}
