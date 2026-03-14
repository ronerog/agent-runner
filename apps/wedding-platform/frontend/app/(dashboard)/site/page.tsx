'use client'

import React, { useEffect, useState } from 'react'
import { weddings, weddingPages } from '../../../lib/api'
import type { WeddingData, WeddingPageData } from '../../../lib/api'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

const PLATFORM_DOMAIN = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || 'localhost:3000'

const SECTIONS = ['home', 'event', 'gallery', 'rsvp']

export default function SiteEditorPage() {
  const [wedding, setWedding] = useState<WeddingData | null>(null)
  const [pages, setPages] = useState<WeddingPageData[]>([])
  const [activeSection, setActiveSection] = useState('home')
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingPage, setIsSavingPage] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Form fields
  const [title, setTitle] = useState('')
  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [venueName, setVenueName] = useState('')
  const [venueAddress, setVenueAddress] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        const weddingListRes = await weddings.list()
        const weddingArr = weddingListRes.results ?? weddingListRes
        if (weddingArr.length === 0) return
        const w: WeddingData = weddingArr[0]
        setWedding(w)
        setTitle(w.title || '')
        setBrideName(w.bride_name || '')
        setGroomName(w.groom_name || '')
        setWeddingDate(w.wedding_date || '')
        setVenueName(w.venue_name || '')
        setVenueAddress(w.venue_address || '')
        setDescription(w.description || '')
        setIsPublished(w.is_published || false)

        if (w.id) {
          const pagesRes = await weddingPages.list(w.id)
          setPages(pagesRes.results ?? pagesRes)
        }
      } catch {
        setError('Failed to load site data.')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const handleSaveWedding = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wedding?.id) return
    setIsSaving(true)
    setSaveMsg('')
    try {
      await weddings.update(wedding.id, {
        title,
        bride_name: brideName,
        groom_name: groomName,
        wedding_date: weddingDate || undefined,
        venue_name: venueName,
        venue_address: venueAddress,
        description,
        is_published: isPublished,
      })
      setSaveMsg('Saved successfully!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setIsSaving(false)
    }
  }

  const getActivePage = () => pages.find((p) => p.section_type === activeSection)

  const handleSavePage = async () => {
    const page = getActivePage()
    if (!page?.id) return
    setIsSavingPage(true)
    try {
      await weddingPages.update(page.id, { content: page.content })
      setSaveMsg('Section saved!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setError('Failed to save section.')
    } finally {
      setIsSavingPage(false)
    }
  }

  const updatePageContent = (key: string, value: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.section_type === activeSection
          ? { ...p, content: { ...p.content, [key]: value } }
          : p,
      ),
    )
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading…</div>
  }

  if (!wedding) {
    return (
      <Card>
        <p className="text-slate-500">No wedding found. <a href="/dashboard" className="text-rose-500">Create one first.</a></p>
      </Card>
    )
  }

  const publicUrl = `http://${wedding.slug}.${PLATFORM_DOMAIN}`
  const activePage = getActivePage()

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl font-semibold text-slate-800 mb-2">Site Editor</h1>
      <p className="text-slate-500 mb-2">
        Public URL: <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline font-mono text-sm">{publicUrl}</a>
      </p>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700 mb-4">{error}</div>
      )}
      {saveMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 mb-4">{saveMsg}</div>
      )}

      {/* Wedding details form */}
      <Card className="mb-6">
        <h2 className="font-semibold text-slate-700 mb-4">Wedding Details</h2>
        <form onSubmit={handleSaveWedding} className="space-y-4">
          <Input id="s-title" label="Wedding title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input id="s-bride" label="Bride's name" value={brideName} onChange={(e) => setBrideName(e.target.value)} required />
            <Input id="s-groom" label="Groom's name" value={groomName} onChange={(e) => setGroomName(e.target.value)} required />
          </div>
          <Input id="s-date" label="Wedding date" type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} />
          <Input id="s-venue" label="Venue name" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Venue address</label>
            <textarea value={venueAddress} onChange={(e) => setVenueAddress(e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Our story (description)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 accent-rose-500"
            />
            <label htmlFor="published" className="text-sm font-medium text-slate-700">
              Published (visible to guests)
            </label>
          </div>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </Card>

      {/* Page sections */}
      <Card>
        <h2 className="font-semibold text-slate-700 mb-4">Page Sections</h2>
        <div className="flex gap-2 mb-6 flex-wrap">
          {SECTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeSection === s ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {activePage ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-3">Editing content for the <span className="font-semibold capitalize">{activeSection}</span> section.</p>
            {Object.entries(activePage.content as Record<string, string>).map(([key, val]) => (
              <div key={key}>
                <label className="text-sm font-medium text-slate-700 block mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                <textarea
                  value={val}
                  onChange={(e) => updatePageContent(key, e.target.value)}
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            ))}
            {Object.keys(activePage.content as Record<string, unknown>).length === 0 && (
              <p className="text-sm text-slate-400">No content fields yet for this section.</p>
            )}
            <Button variant="secondary" onClick={handleSavePage} disabled={isSavingPage}>
              {isSavingPage ? 'Saving section…' : 'Save section'}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No page data for this section yet.</p>
        )}
      </Card>
    </div>
  )
}
