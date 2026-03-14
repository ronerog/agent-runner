import React from 'react'
import { weddings } from '../../../../lib/api'

interface Props {
  params: { slug: string }
}

export default async function EventoPage({ params }: Props) {
  let wedding = null

  try {
    wedding = await weddings.getBySlug(params.slug)
  } catch {
    return <div className="text-center py-20 text-slate-400">Event not found.</div>
  }

  const formattedDate = wedding?.wedding_date
    ? new Date(wedding.wedding_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl text-slate-800 mb-4">Event Details</h1>
        <p className="text-slate-500">Everything you need to know about our big day.</p>
      </div>

      <div className="grid gap-6">
        {/* Date & Time */}
        {formattedDate && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="text-4xl">📅</div>
              <div>
                <h2 className="font-semibold text-slate-800 text-xl mb-2">Date</h2>
                <p className="text-slate-600 text-lg">{formattedDate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Venue */}
        {wedding?.venue_name && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="text-4xl">📍</div>
              <div>
                <h2 className="font-semibold text-slate-800 text-xl mb-2">Venue</h2>
                <p className="text-slate-700 font-medium text-lg">{wedding.venue_name}</p>
                {wedding.venue_address && (
                  <p className="text-slate-500 mt-1">{wedding.venue_address}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {wedding?.description && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="text-4xl">💌</div>
              <div>
                <h2 className="font-semibold text-slate-800 text-xl mb-2">About the Event</h2>
                <p className="text-slate-600 leading-relaxed">{wedding.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Map placeholder */}
        <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center border border-slate-200">
          <div className="text-center text-slate-400">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-sm">Map view coming soon</p>
            {wedding?.venue_address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(wedding.venue_address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-500 hover:underline text-sm mt-2 block"
              >
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
