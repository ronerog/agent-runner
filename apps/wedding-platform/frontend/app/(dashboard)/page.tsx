'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { weddings, guests, gifts } from '../../lib/api'
import type { WeddingData } from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost:3000'

interface Stats {
  totalGuests: number
  confirmedGuests: number
  totalGifts: number
  purchasedGifts: number
}

export default function DashboardPage() {
  const [wedding, setWedding] = useState<WeddingData | null>(null)
  const [stats, setStats] = useState<Stats>({ totalGuests: 0, confirmedGuests: 0, totalGifts: 0, purchasedGifts: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')

  // Create form state
  const [title, setTitle] = useState('')
  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const [slug, setSlug] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [venueName, setVenueName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const weddingList = await weddings.list()
      if (weddingList.results?.length > 0 || weddingList.length > 0) {
        const w = weddingList.results?.[0] ?? weddingList[0]
        setWedding(w)
        if (w.id) {
          const [guestList, giftList] = await Promise.all([
            guests.list(w.id),
            gifts.list(w.id),
          ])
          const guestArr = guestList.results ?? guestList
          const giftArr = giftList.results ?? giftList
          setStats({
            totalGuests: guestArr.length,
            confirmedGuests: guestArr.filter((g: { status: string }) => g.status === 'confirmed').length,
            totalGifts: giftArr.length,
            purchasedGifts: giftArr.filter((g: { is_purchased: boolean }) => g.is_purchased).length,
          })
        }
      } else {
        setShowCreateForm(true)
      }
    } catch {
      setShowCreateForm(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await weddings.create({
        title,
        slug,
        bride_name: brideName,
        groom_name: groomName,
        wedding_date: weddingDate || undefined,
        venue_name: venueName,
      })
      await loadData()
      setShowCreateForm(false)
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: Record<string, string[]> } }
      const firstError = apiError.response?.data
      if (firstError) {
        const msgs = Object.values(firstError).flat()
        setError(msgs[0] || 'Failed to create wedding.')
      } else {
        setError('Failed to create wedding. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Loading your wedding…</p>
      </div>
    )
  }

  if (showCreateForm && !wedding) {
    return (
      <div className="max-w-lg mx-auto">
        <h1 className="font-serif text-3xl font-semibold text-slate-800 mb-2">
          Create your wedding site
        </h1>
        <p className="text-slate-500 mb-8">
          Fill in the details below to get started.
        </p>

        <Card>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <Input id="title" label="Wedding title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sofia & Rafael's Wedding" required />
            <div className="grid grid-cols-2 gap-4">
              <Input id="bride_name" label="Bride's name" value={brideName} onChange={(e) => setBrideName(e.target.value)} placeholder="Sofia" required />
              <Input id="groom_name" label="Groom's name" value={groomName} onChange={(e) => setGroomName(e.target.value)} placeholder="Rafael" required />
            </div>
            <Input id="slug" label="Subdomain (your URL)" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="sofiaandrafael" required />
            <p className="text-xs text-slate-400 -mt-2">
              Your site will be at: <span className="font-mono">{slug || 'yourname'}.{PLATFORM_DOMAIN}</span>
            </p>
            <Input id="wedding_date" label="Wedding date" type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} />
            <Input id="venue_name" label="Venue name" value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="Grand Ballroom" />

            <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating…' : 'Create wedding site'}
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  if (!wedding) return null

  const publicUrl = `http://${wedding.slug}.${PLATFORM_DOMAIN}`

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-semibold text-slate-800">
          Welcome back! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          Here&apos;s an overview of <span className="font-medium text-rose-500">{wedding.bride_name} &amp; {wedding.groom_name}</span>&apos;s wedding.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <div className="text-3xl font-bold text-slate-800">{stats.totalGuests}</div>
          <div className="text-sm text-slate-500 mt-1">Total guests</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">{stats.confirmedGuests}</div>
          <div className="text-sm text-slate-500 mt-1">Confirmed RSVPs</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-slate-800">{stats.totalGifts}</div>
          <div className="text-sm text-slate-500 mt-1">Gifts listed</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-gold-600">{stats.purchasedGifts}</div>
          <div className="text-sm text-slate-500 mt-1">Gifts purchased</div>
        </Card>
      </div>

      {/* Public URL */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800 mb-1">Your public wedding site</h2>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-500 hover:underline text-sm font-mono"
            >
              {publicUrl}
            </a>
          </div>
          <div className="flex items-center gap-2">
            {wedding.is_published ? (
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Published</span>
            ) : (
              <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full">Draft</span>
            )}
          </div>
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <h3 className="font-semibold text-slate-700 mb-3">Edit site content</h3>
          <p className="text-sm text-slate-500 mb-4">Update your wedding details, venue info, and more.</p>
          <Link href="/dashboard/site">
            <Button variant="secondary" className="w-full">Go to Site Editor</Button>
          </Link>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-700 mb-3">Manage guests</h3>
          <p className="text-sm text-slate-500 mb-4">Add guests, track RSVPs, and manage attendance.</p>
          <Link href="/dashboard/guests">
            <Button variant="secondary" className="w-full">Go to Guests</Button>
          </Link>
        </Card>
        <Card>
          <h3 className="font-semibold text-slate-700 mb-3">Manage gifts</h3>
          <p className="text-sm text-slate-500 mb-4">Create and manage your wedding gift list.</p>
          <Link href="/dashboard/gifts">
            <Button variant="secondary" className="w-full">Go to Gifts</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
