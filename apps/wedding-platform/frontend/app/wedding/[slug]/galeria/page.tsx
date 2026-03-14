import React from 'react'

interface Props {
  params: { slug: string }
}

// Placeholder gallery images (will be replaced with real images from wedding data)
const placeholderImages = [
  { id: 1, alt: 'Couple photo 1', color: 'bg-rose-100' },
  { id: 2, alt: 'Couple photo 2', color: 'bg-pink-100' },
  { id: 3, alt: 'Couple photo 3', color: 'bg-rose-200' },
  { id: 4, alt: 'Venue photo', color: 'bg-slate-100' },
  { id: 5, alt: 'Couple photo 4', color: 'bg-rose-50' },
  { id: 6, alt: 'Couple photo 5', color: 'bg-pink-50' },
]

export default function GaleriaPage({ params: _params }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl text-slate-800 mb-4">Our Gallery</h1>
        <p className="text-slate-500">Capturing our love, one moment at a time.</p>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {placeholderImages.map((img) => (
          <div
            key={img.id}
            className={`${img.color} rounded-2xl aspect-square flex items-center justify-center border border-slate-100`}
          >
            <div className="text-center text-slate-400">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-xs">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-slate-400 text-sm mt-12">
        Photos will be added as we get closer to the big day!
      </p>
    </div>
  )
}
