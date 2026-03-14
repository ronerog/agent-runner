import React from 'react'
import Link from 'next/link'
import { weddings } from '../../../lib/api'
import type { WeddingData } from '../../../lib/api'

interface Props {
  params: { slug: string }
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate).getTime()
  const now = Date.now()
  const diff = target - now
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))

  return (
    <div className="flex justify-center gap-8 mt-8">
      <div className="text-center">
        <div className="text-5xl font-bold text-white">{days}</div>
        <div className="text-rose-200 text-sm mt-1">Days to go</div>
      </div>
    </div>
  )
}

export default async function WeddingHomePage({ params }: Props) {
  let wedding: WeddingData | null = null

  try {
    wedding = await weddings.getBySlug(params.slug)
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Wedding not found.</p>
      </div>
    )
  }

  if (!wedding) return null

  const formattedDate = wedding.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center"
        style={{
          background: wedding.cover_image
            ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${wedding.cover_image}) center/cover no-repeat`
            : 'linear-gradient(135deg, #f43f5e 0%, #be123c 50%, #9f1239 100%)',
        }}
      >
        <div className="relative z-10 px-6 max-w-2xl mx-auto">
          <p className="text-rose-200 text-sm font-medium tracking-widest uppercase mb-6">
            We&apos;re getting married
          </p>
          <h1 className="font-serif text-6xl md:text-7xl font-semibold text-white leading-tight">
            {wedding.bride_name}
            <span className="text-rose-200 mx-4">&</span>
            {wedding.groom_name}
          </h1>

          {formattedDate && (
            <p className="text-rose-100 text-lg mt-6">{formattedDate}</p>
          )}
          {wedding.venue_name && (
            <p className="text-rose-200 text-sm mt-2">{wedding.venue_name}</p>
          )}

          {wedding.wedding_date && <CountdownTimer targetDate={wedding.wedding_date} />}

          <div className="flex gap-4 justify-center mt-10">
            <Link
              href={`/wedding/${params.slug}/rsvp`}
              className="bg-white text-rose-600 font-semibold px-8 py-3 rounded-full hover:bg-rose-50 transition-colors"
            >
              RSVP Now
            </Link>
            <Link
              href={`/wedding/${params.slug}/presentes`}
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Gift List
            </Link>
          </div>
        </div>
      </section>

      {/* Our Story */}
      {wedding.description && (
        <section className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h2 className="font-serif text-3xl text-slate-800 mb-6">Our Story</h2>
          <p className="text-slate-600 leading-relaxed text-lg">{wedding.description}</p>
        </section>
      )}

      {/* Venue Section */}
      {wedding.venue_name && (
        <section className="bg-warm-100 py-16">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl text-slate-800 mb-4">Where We&apos;ll Celebrate</h2>
            <p className="text-slate-700 font-semibold text-xl mb-2">{wedding.venue_name}</p>
            {wedding.venue_address && (
              <p className="text-slate-500">{wedding.venue_address}</p>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href={`/wedding/${params.slug}/galeria`} className="group">
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="font-serif text-xl text-slate-800 mb-2">Gallery</h3>
              <p className="text-slate-500 text-sm">See our journey together</p>
            </div>
          </Link>
          <Link href={`/wedding/${params.slug}/presentes`} className="group">
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-serif text-xl text-slate-800 mb-2">Gift List</h3>
              <p className="text-slate-500 text-sm">Find the perfect gift for us</p>
            </div>
          </Link>
          <Link href={`/wedding/${params.slug}/rsvp`} className="group">
            <div className="bg-rose-500 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">💌</div>
              <h3 className="font-serif text-xl text-white mb-2">RSVP</h3>
              <p className="text-rose-100 text-sm">Confirm your attendance</p>
            </div>
          </Link>
        </div>
      </section>
    </>
  )
}
