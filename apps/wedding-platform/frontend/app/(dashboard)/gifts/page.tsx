'use client'

import React, { useEffect, useState } from 'react'
import { weddings, gifts } from '../../../lib/api'
import type { GiftData } from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function GiftsPage() {
  const [weddingId, setWeddingId] = useState<string>('')
  const [giftList, setGiftList] = useState<GiftData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Add form
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [externalLink, setExternalLink] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const weddingListRes = await weddings.list()
        const weddingArr = weddingListRes.results ?? weddingListRes
        if (weddingArr.length === 0) return
        const w = weddingArr[0]
        setWeddingId(w.id)
        await loadGifts(w.id)
      } catch {
        setError('Failed to load data.')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const loadGifts = async (wid: string) => {
    const res = await gifts.list(wid)
    setGiftList(res.results ?? res)
  }

  const handleAddGift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !weddingId) return
    setIsAdding(true)
    try {
      await gifts.create(weddingId, {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        external_link: externalLink,
      })
      setName('')
      setDescription('')
      setPrice('')
      setExternalLink('')
      setShowForm(false)
      await loadGifts(weddingId)
    } catch {
      setError('Failed to add gift.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this gift?')) return
    try {
      await gifts.remove(id)
      setGiftList((prev) => prev.filter((g) => g.id !== id))
    } catch {
      setError('Failed to remove gift.')
    }
  }

  const formatCurrency = (price?: number) => {
    if (price == null) return null
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading gifts…</div>
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-3xl font-semibold text-slate-800">Gift List</h1>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add gift'}
        </Button>
      </div>
      <p className="text-slate-500 mb-8">Manage your wedding gift list.</p>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700 mb-4">
          {error}
        </div>
      )}

      {/* Add gift form */}
      {showForm && (
        <Card className="mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">Add new gift</h2>
          <form onSubmit={handleAddGift} className="space-y-4">
            <Input id="g-name" label="Gift name" value={name} onChange={(e) => setName(e.target.value)} placeholder="KitchenAid Stand Mixer" required />
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description…"
                rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input id="g-price" label="Price (BRL)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="299.90" />
              <Input id="g-link" label="Store link (optional)" value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." />
            </div>
            <Button type="submit" variant="primary" disabled={isAdding}>
              {isAdding ? 'Adding…' : 'Add gift'}
            </Button>
          </form>
        </Card>
      )}

      {/* Gift grid */}
      {giftList.length === 0 ? (
        <Card className="text-center py-16">
          <div className="text-4xl mb-4">🎁</div>
          <p className="text-slate-500">No gifts added yet. Start building your list!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {giftList.map((gift) => (
            <Card key={gift.id} className="relative">
              {gift.is_purchased && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    ✓ Purchased
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-slate-800 pr-16">{gift.name}</h3>
              {gift.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{gift.description}</p>
              )}
              {gift.price != null && (
                <p className="text-gold-600 font-semibold mt-2">{formatCurrency(gift.price)}</p>
              )}
              {gift.is_purchased && gift.purchased_by && (
                <p className="text-xs text-green-600 mt-1">Purchased by: {gift.purchased_by}</p>
              )}
              {gift.external_link && (
                <a href={gift.external_link} target="_blank" rel="noopener noreferrer" className="text-xs text-rose-500 hover:underline mt-1 block">
                  View in store
                </a>
              )}
              {!gift.is_purchased && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => gift.id && handleRemove(gift.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors text-xs"
                  >
                    Remove
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
