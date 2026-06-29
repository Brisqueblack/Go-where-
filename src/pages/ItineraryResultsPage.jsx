/**
 * ItineraryResultsPage.jsx
 * Shows loading state during generation, then the full itinerary results
 * with a timeline view styled per the brand guide.
 */

import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/ui'
import FeedbackSection from '../components/FeedbackSection'
import { generateItinerary } from '../services/api.js'

const timeEmoji = { morning: '🌅', afternoon: '☀️', evening: '🌙' }

export default function ItineraryResultsPage({ preferences, onBack, onNewSearch }) {
  const [loading, setLoading] = useState(true)
  const [itinerary, setItinerary] = useState(null)
  const [error, setError] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(null)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    const start = performance.now()
    const timer = setTimeout(async () => {
      try {
        const vibes = Array.isArray(preferences.vibes)
          ? preferences.vibes.join(', ')
          : preferences.vibes || 'balanced'

        const result = await generateItinerary({
          destination: preferences.location || preferences.where || 'New York City',
          duration_days: preferences.time === 'multi-day' ? 3 : 1,
          budget_level: preferences.budget || 'moderate',
          vibes,
          preferences: preferences.interests || '',
        })

        if (result.success) {
          setItinerary(result.data)
          setElapsedMs(Math.round(performance.now() - start))
        } else {
          setError(result.error || 'Generation failed')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [preferences])

  const fmt = (n) => (n == null ? '—' : `$${n}`)

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 border-4 border-teal/30 border-t-teal rounded-full animate-spin mb-6" />
        <h2 className="text-white font-heading text-xl font-bold mb-2">Planning your adventure...</h2>
        <p className="text-text-muted text-sm text-center max-w-xs">
          Our AI is finding the best spots for your vibe
        </p>
        <div className="mt-10 space-y-3 w-full max-w-xs">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 rounded-[12px] animate-pulse" />)}
        </div>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mb-4 text-2xl">😕</div>
        <h2 className="text-white font-heading text-lg font-bold mb-2">Something went wrong</h2>
        <p className="text-text-muted text-sm mb-6 text-center">{error}</p>
        <Button variant="secondary" onClick={onBack}>Try Again</Button>
      </div>
    )
  }

  // Success
  return (
    <div className="min-h-screen bg-sand pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">
          <button onClick={onNewSearch} className="text-teal text-sm font-medium font-body cursor-pointer">New Search</button>
          <h1 className="text-sm font-heading font-semibold text-text-primary">Your Itinerary</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {/* Summary */}
        <div className="bg-white rounded-[12px] p-6 shadow-card mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-heading font-bold text-text-primary text-xl mb-1">{itinerary.title}</h2>
              <p className="text-text-secondary text-sm">
                {itinerary.destination} · {itinerary.duration_days}d · {itinerary.budget_level}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-teal">{fmt(itinerary.total_estimated_cost)}</div>
              <div className="text-text-muted text-xs">estimated total</div>
            </div>
          </div>
          {itinerary.notes && (
            <div className="mt-4 p-3 bg-amber/10 border border-amber/20 rounded-[8px] text-sm text-amber">💡 {itinerary.notes}</div>
          )}
          {elapsedMs && <div className="mt-3 text-text-muted text-xs">Generated in {elapsedMs}ms</div>}
        </div>

        {/* Days */}
        <div className="space-y-6">
          {itinerary.days.map(day => (
            <div key={day.day_number}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-teal rounded-full flex items-center justify-center text-white text-xs font-bold font-heading">
                  {day.day_number}
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-text-primary text-base">Day {day.day_number}</h3>
                  {day.theme && <p className="text-teal text-xs">{day.theme}</p>}
                </div>
              </div>
              <div className="relative pl-6 border-l-2 border-teal/20 space-y-4 ml-3">
                {day.items.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-[12px] p-4 shadow-card relative">
                    <div className="absolute -left-[25px] top-5 w-3 h-3 bg-teal rounded-full border-2 border-white" />
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs">{timeEmoji[item.time_slot] || ''}</span>
                          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">{item.time_slot}</span>
                        </div>
                        <h4 className="font-body font-semibold text-text-primary text-sm">{item.name}</h4>
                        <p className="text-text-secondary text-xs mt-0.5">{item.description}</p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-text-primary">{fmt(item.estimated_cost)}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-text-muted capitalize bg-teal/5 px-2 py-0.5 rounded">{item.category}</span>
                      {item.latitude && (
                        <a href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-teal hover:underline">📍 View on Maps</a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback section */}
        {itinerary.id && <FeedbackSection itineraryId={itinerary.id} />}
      </div>
    </div>
  )
}