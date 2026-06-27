/**
 * ItineraryDemo.jsx — Interactive demo for the AI itinerary generator
 */
import { useState } from 'react'
import { useItineraryGenerator } from '../hooks/useItineraryGenerator.js'

export default function ItineraryDemo() {
  const [destination, setDestination] = useState('New York City')
  const [duration, setDuration] = useState(2)
  const [budget, setBudget] = useState('moderate')
  const [vibes, setVibes] = useState('foodie, culture')
  const [showForm, setShowForm] = useState(false)
  const { loading, itinerary, error, elapsedMs, generate, reset } = useItineraryGenerator()

  const handleGenerate = (e) => { e.preventDefault(); generate({ destination, duration_days: duration, budget_level: budget, vibes }) }
  const fmt = (n) => (n == null ? '—' : `$${n}`)
  const slotLabel = { morning: '🌅 Morning', afternoon: '☀️ Afternoon', evening: '🌙 Evening' }

  return (
    <div className="min-h-screen bg-navy px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <img src="/logo-icon.png" alt="" className="w-12 h-12 mx-auto mb-3" />
          <h1 className="font-heading text-2xl font-bold text-white mb-2">AI Itinerary Engine</h1>
          <p className="text-text-muted text-sm">Mock provider active — real LLM integration ready</p>
        </div>
        <div className="text-center mb-8">
          <button onClick={() => { reset(); setShowForm(!showForm) }}
            className="px-5 py-2.5 rounded-[8px] bg-coral hover:brightness-90 text-white font-medium text-sm transition-all cursor-pointer">
            {showForm ? 'Hide Form' : 'Try Itinerary Generator →'}
          </button>
        </div>
        {showForm && !itinerary && (
          <form onSubmit={handleGenerate} className="bg-white rounded-[12px] p-6 mb-8 shadow-card max-w-lg mx-auto">
            <h2 className="font-heading font-semibold text-text-primary text-lg mb-4">Plan Your Trip</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-text-primary text-sm font-medium mb-1">Destination</label>
                <input value={destination} onChange={e => setDestination(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border-2 border-gray-200 focus:border-teal outline-none text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-1">Days</label>
                  <select value={duration} onChange={e => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-[8px] border-2 border-gray-200 focus:border-teal outline-none text-sm">
                    {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d}d</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-text-primary text-sm font-medium mb-1">Budget</label>
                  <select value={budget} onChange={e => setBudget(e.target.value)}
                    className="w-full px-3 py-2 rounded-[8px] border-2 border-gray-200 focus:border-teal outline-none text-sm">
                    <option value="budget">Budget</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-text-primary text-sm font-medium mb-1">Vibes</label>
                <input value={vibes} onChange={e => setVibes(e.target.value)} placeholder="foodie, culture, hidden gems"
                  className="w-full px-3 py-2 rounded-[8px] border-2 border-gray-200 focus:border-teal outline-none text-sm" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-[8px] bg-coral hover:brightness-90 disabled:opacity-50 text-white font-medium text-sm transition-all cursor-pointer">
                {loading ? '✨ Generating...' : '✨ Generate'}
              </button>
            </div>
            {error && <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-[8px] text-error text-sm">{error}</div>}
          </form>
        )}
        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted text-sm">Planning your perfect itinerary...</p>
          </div>
        )}
        {itinerary && !loading && (
          <div>
            <div className="bg-white rounded-[12px] p-6 shadow-card mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-heading font-bold text-text-primary text-xl mb-1">{itinerary.title}</h2>
                  <p className="text-text-secondary text-sm">{itinerary.destination} · {itinerary.duration_days}d · {itinerary.budget_level}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal">{fmt(itinerary.total_estimated_cost)}</div>
                  <div className="text-text-muted text-xs">estimated total</div>
                </div>
              </div>
              {itinerary.notes && <div className="mt-4 p-3 bg-amber/10 border border-amber/20 rounded-[8px] text-sm text-amber">💡 {itinerary.notes}</div>}
              {elapsedMs && <div className="mt-3 text-text-muted text-xs">Generated in {elapsedMs}ms · Provider: mock</div>}
            </div>
            <div className="space-y-6">
              {itinerary.days.map(day => (
                <div key={day.day_number} className="bg-white rounded-[12px] p-6 shadow-card">
                  <h3 className="font-heading font-semibold text-text-primary text-lg mb-1">Day {day.day_number}</h3>
                  {day.theme && <p className="text-teal text-sm font-medium mb-4">{day.theme}</p>}
                  <div className="space-y-4">
                    {day.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="w-24 shrink-0">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-navy/5 text-text-secondary">
                            {slotLabel[item.time_slot] || item.time_slot}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-text-primary font-medium text-sm">{item.name}</h4>
                              <p className="text-text-secondary text-xs mt-0.5">{item.description}</p>
                            </div>
                            <span className="shrink-0 text-sm font-medium text-text-primary">{fmt(item.estimated_cost)}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-text-muted capitalize bg-teal/5 px-2 py-0.5 rounded">{item.category}</span>
                            {item.latitude && <span className="text-xs text-text-muted">📍 {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={() => generate({ destination, duration_days: duration, budget_level: budget, vibes })}
                className="px-5 py-2.5 rounded-[8px] bg-teal hover:brightness-90 text-white font-medium text-sm transition-all cursor-pointer">🔄 Regenerate</button>
              <button onClick={() => { reset(); setShowForm(true) }}
                className="px-5 py-2.5 rounded-[8px] border-2 border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-all cursor-pointer">New Search</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}