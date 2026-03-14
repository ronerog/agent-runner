'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { weddings, gifts } from '../../../../lib/api'
import type { GiftData } from '../../../../lib/api'

export default function PresentesPage() {
  const params = useParams()
  const slug = params.slug as string

  const [giftList, setGiftList] = useState<GiftData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Modal state
  const [selectedGift, setSelectedGift] = useState<GiftData | null>(null)
  const [purchaserName, setPurchaserName] = useState('')
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const init = async () => {
      try {
        const wedding = await weddings.getBySlug(slug)
        if (wedding?.id) {
          const res = await gifts.list(wedding.id)
          setGiftList(res.results ?? res)
        }
      } catch {
        setError('Failed to load gift list.')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [slug])

  const handlePurchase = async () => {
    if (!selectedGift?.id || !purchaserName.trim()) return
    setIsPurchasing(true)
    try {
      await gifts.markPurchased(selectedGift.id, purchaserName)
      setGiftList((prev) =>
        prev.map((g) =>
          g.id === selectedGift.id
            ? { ...g, is_purchased: true, purchased_by: purchaserName }
            : g,
        ),
      )
      setSuccessMsg(`Thank you, ${purchaserName}! Your gift has been reserved.`)
      setSelectedGift(null)
      setPurchaserName('')
    } catch {
      setError('Failed to reserve gift. It may have already been taken.')
    } finally {
      setIsPurchasing(false)
    }
  }

  const formatCurrency = (price?: number) => {
    if (price == null) return null
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
  }

  if (isLoading) {
    return <div className="text-center py-20 text-slate-400">Loading gifts…</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl text-slate-800 mb-4">Gift List</h1>
        <p className="text-slate-500">Help us start our life together with something special.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700 mb-6">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center mb-8">
          <div className="text-3xl mb-2">🎁</div>
          <p className="text-green-700 font-medium">{successMsg}</p>
        </div>
      )}

      {giftList.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-4">🎁</div>
          <p>No gifts have been added yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {giftList.map((gift) => (
            <div
              key={gift.id}
              className={`bg-white rounded-2xl border p-6 ${
                gift.is_purchased ? 'opacity-60 border-slate-200' : 'border-slate-100 shadow-sm hover:shadow-md transition-shadow'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-800">{gift.name}</h3>
                {gift.is_purchased && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ml-2">
                    Already chosen
                  </span>
                )}
              </div>

              {gift.description && (
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{gift.description}</p>
              )}

              {gift.price != null && (
                <p className="text-gold-600 font-semibold mb-4">{formatCurrency(gift.price)}</p>
              )}

              {gift.external_link && (
                <a
                  href={gift.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-rose-500 transition-colors block mb-4"
                >
                  View product →
                </a>
              )}

              {!gift.is_purchased ? (
                <button
                  onClick={() => setSelectedGift(gift)}
                  className="w-full bg-rose-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-rose-600 transition-colors"
                >
                  I want to give this gift
                </button>
              ) : (
                gift.purchased_by && (
                  <p className="text-xs text-green-600 text-center">
                    Given by: {gift.purchased_by}
                  </p>
                )
              )}
            </div>
          ))}
        </div>
      )}

      {/* Purchase Modal */}
      {selectedGift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="font-serif text-2xl text-slate-800 mb-2">Reserve this gift</h2>
            <p className="text-slate-500 text-sm mb-6">
              You are reserving: <span className="font-medium text-slate-700">{selectedGift.name}</span>
            </p>

            <div className="mb-4">
              <label className="text-sm font-medium text-slate-700 block mb-1">Your name</label>
              <input
                type="text"
                value={purchaserName}
                onChange={(e) => setPurchaserName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedGift(null); setPurchaserName('') }}
                className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={!purchaserName.trim() || isPurchasing}
                className="flex-1 bg-rose-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
              >
                {isPurchasing ? 'Confirming…' : 'Confirm gift'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
