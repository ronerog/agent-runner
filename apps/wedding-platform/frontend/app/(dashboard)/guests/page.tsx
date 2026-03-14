'use client'

import React, { useEffect, useState } from 'react'
import { weddings, guests } from '../../../lib/api'
import type { GuestData } from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

const statusConfig: Record<string, { label: string; className: string }> = {
  invited: { label: 'Invited', className: 'bg-blue-100 text-blue-700' },
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700' },
  declined: { label: 'Declined', className: 'bg-red-100 text-red-700' },
}

export default function GuestsPage() {
  const [weddingId, setWeddingId] = useState<string>('')
  const [guestList, setGuestList] = useState<GuestData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Add form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const weddingListRes = await weddings.list()
        const weddingArr = weddingListRes.results ?? weddingListRes
        if (weddingArr.length === 0) return
        const w = weddingArr[0]
        setWeddingId(w.id)
        await loadGuests(w.id)
      } catch {
        setError('Failed to load data.')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const loadGuests = async (wid: string) => {
    const res = await guests.list(wid)
    setGuestList(res.results ?? res)
  }

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !weddingId) return
    setIsAdding(true)
    try {
      await guests.create(weddingId, { name, email, phone })
      setName('')
      setEmail('')
      setPhone('')
      await loadGuests(weddingId)
    } catch {
      setError('Failed to add guest.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleRemove = async (id: string) => {
    if (!confirm('Remove this guest?')) return
    try {
      await guests.remove(id)
      setGuestList((prev) => prev.filter((g) => g.id !== id))
    } catch {
      setError('Failed to remove guest.')
    }
  }

  const counts = {
    total: guestList.length,
    confirmed: guestList.filter((g) => g.status === 'confirmed').length,
    declined: guestList.filter((g) => g.status === 'declined').length,
    invited: guestList.filter((g) => g.status === 'invited').length,
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading guests…</div>
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl font-semibold text-slate-800 mb-2">Guests</h1>
      <p className="text-slate-500 mb-8">Manage your guest list and track RSVPs.</p>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700 mb-4">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-slate-800">{counts.total}</div>
          <div className="text-xs text-slate-500 mt-1">Total</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-green-600">{counts.confirmed}</div>
          <div className="text-xs text-slate-500 mt-1">Confirmed</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-red-500">{counts.declined}</div>
          <div className="text-xs text-slate-500 mt-1">Declined</div>
        </Card>
        <Card className="text-center py-4">
          <div className="text-2xl font-bold text-blue-500">{counts.invited}</div>
          <div className="text-xs text-slate-500 mt-1">Pending</div>
        </Card>
      </div>

      {/* Add guest form */}
      <Card className="mb-6">
        <h2 className="font-semibold text-slate-700 mb-4">Add guest</h2>
        <form onSubmit={handleAddGuest} className="flex gap-3 flex-wrap">
          <Input id="g-name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 min-w-40" required />
          <Input id="g-email" type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 min-w-40" />
          <Input id="g-phone" placeholder="Phone (optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 min-w-32" />
          <Button type="submit" variant="primary" disabled={isAdding}>
            {isAdding ? 'Adding…' : '+ Add'}
          </Button>
        </form>
      </Card>

      {/* Guest table */}
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Name</th>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Email</th>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Phone</th>
              <th className="text-left px-6 py-3 font-medium text-slate-600">Status</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {guestList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-slate-400 py-10">
                  No guests yet. Add your first guest above.
                </td>
              </tr>
            ) : (
              guestList.map((guest) => {
                const sc = statusConfig[guest.status || 'invited']
                return (
                  <tr key={guest.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-800">{guest.name}</td>
                    <td className="px-6 py-3 text-slate-500">{guest.email || '—'}</td>
                    <td className="px-6 py-3 text-slate-500">{guest.phone || '—'}</td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full text-xs font-medium px-2.5 py-1 ${sc.className}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => guest.id && handleRemove(guest.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
