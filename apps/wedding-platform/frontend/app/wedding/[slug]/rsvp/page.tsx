'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { guests, rsvp } from '../../../../lib/api'

type ConfirmStatus = 'yes' | 'no' | null

export default function RSVPPage() {
  const params = useParams()
  const slug = params.slug as string

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmed, setConfirmed] = useState<ConfirmStatus>(null)
  const [plusOne, setPlusOne] = useState(false)
  const [plusOneName, setPlusOneName] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState('')
  const [message, setMessage] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedConfirmed, setSubmittedConfirmed] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmed) {
      setError('Please select whether you will attend.')
      return
    }
    setError('')
    setIsSubmitting(true)

    try {
      // Try to find or create the guest by slug+name
      const weddingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/weddings/by-slug/${slug}/`,
      )
      const wedding = await weddingRes.json()

      // Create guest if they don't exist
      const guestData = await guests.create(wedding.id, {
        name: fullName,
        email: email,
      })

      // Submit RSVP
      await rsvp.create(guestData.id, {
        confirmed: confirmed === 'yes',
        plus_one: plusOne,
        plus_one_name: plusOneName,
        dietary_restrictions: dietaryRestrictions,
        message,
      })

      setSubmittedConfirmed(confirmed === 'yes')
      setSubmitted(true)
    } catch {
      setError('Failed to submit RSVP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {submittedConfirmed ? (
            <>
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="font-serif text-4xl text-slate-800 mb-4">
                Thank you!
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                We can&apos;t wait to celebrate with you! Your RSVP has been confirmed. See you on our special day!
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">💝</div>
              <h1 className="font-serif text-4xl text-slate-800 mb-4">
                We&apos;ll miss you!
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                Thank you for letting us know. We&apos;ll be thinking of you on our special day.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="font-serif text-5xl text-slate-800 mb-4">RSVP</h1>
        <p className="text-slate-500">Let us know if you&apos;ll be joining us on our special day.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              Full name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">
              Will you attend? <span className="text-rose-500">*</span>
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="confirmed"
                  value="yes"
                  checked={confirmed === 'yes'}
                  onChange={() => setConfirmed('yes')}
                  className="accent-rose-500"
                />
                <span className="text-sm text-slate-700">Yes, I&apos;ll be there!</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="confirmed"
                  value="no"
                  checked={confirmed === 'no'}
                  onChange={() => setConfirmed('no')}
                  className="accent-rose-500"
                />
                <span className="text-sm text-slate-700">Regretfully, I can&apos;t make it</span>
              </label>
            </div>
          </div>

          {confirmed === 'yes' && (
            <>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={plusOne}
                    onChange={(e) => setPlusOne(e.target.checked)}
                    className="accent-rose-500"
                  />
                  <span className="text-sm text-slate-700">I will bring a guest (+1)</span>
                </label>
              </div>

              {plusOne && (
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Guest name</label>
                  <input
                    type="text"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    placeholder="Your guest's full name"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Dietary restrictions</label>
                <textarea
                  value={dietaryRestrictions}
                  onChange={(e) => setDietaryRestrictions(e.target.value)}
                  placeholder="Vegetarian, vegan, allergies, etc."
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Message (optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave us a message!"
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !confirmed}
            className="w-full bg-rose-500 text-white font-semibold py-3 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending…' : 'Send RSVP'}
          </button>
        </form>
      </div>
    </div>
  )
}
