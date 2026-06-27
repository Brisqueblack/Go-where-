import { useState } from 'react'
import { Button } from '../components/ui'

/**
 * Activity Detail Screen (Screen 5)
 * Full information about one recommended activity.
 */
export default function ActivityDetailPage({ item, onBack }) {
  const [isSaved, setIsSaved] = useState(false)

  if (!item) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <p className="text-text-secondary">Activity not found</p>
      </div>
    )
  }

  const handleBook = () => {
    if (item.booking_url) {
      window.open(item.booking_url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleDirections = () => {
    if (item.latitude && item.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const formatCategory = (cat) => {
    const labels = {
      restaurant: '🍽️',
      museum: '🏛️',
      park: '🌳',
      shopping: '🛍️',
      entertainment: '🎭',
      outdoor: '🌿',
      landmark: '🏛️',
      transport: '🚇',
    }
    return labels[cat] || '📍'
  }

  return (
    <div className="min-h-screen bg-sand flex flex-col">
      {/* Hero Image */}
      <div className="relative h-72 md:h-96 bg-gradient-to-b from-navy to-teal/60 overflow-hidden">
        {/* Placeholder background pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/brand-pattern.png)', backgroundSize: '200px' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
          aria-label="Back"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Save/Heart button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors cursor-pointer"
          aria-label={isSaved ? 'Remove from saved' : 'Save'}
        >
          <svg
            className={`w-5 h-5 transition-colors ${isSaved ? 'text-coral fill-coral' : 'text-white'}`}
            fill={isSaved ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Activity name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{formatCategory(item.category)}</span>
            <h1 className="text-white font-heading font-bold text-2xl md:text-3xl">
              {item.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Info Bar */}
        <div className="bg-white rounded-t-[16px] -mt-4 relative z-10">
          <div className="flex items-center justify-around py-4 px-2 divide-x divide-gray-100">
            <div className="flex-1 text-center">
              <p className="text-amber font-semibold text-sm">{item.rating} ★</p>
              <p className="text-text-muted text-[10px] font-body mt-0.5">Rating</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-text-primary font-semibold text-sm">
                {item.estimated_cost === 0 ? 'Free' : `$${item.estimated_cost}`}
              </p>
              <p className="text-text-muted text-[10px] font-body mt-0.5">Est. cost</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-text-primary font-semibold text-sm capitalize">{item.time_slot}</p>
              <p className="text-text-muted text-[10px] font-body mt-0.5">Time</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-text-primary font-semibold text-sm">{item.duration || '—'}</p>
              <p className="text-text-muted text-[10px] font-body mt-0.5">Duration</p>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-5 mt-4">
          {/* Description */}
          <div>
            <h3 className="text-text-primary font-heading font-semibold text-sm mb-2">About</h3>
            <p className="text-text-secondary text-sm font-body leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => {
                const isPopular = tag === 'Popular' || tag === 'Must Try' || tag === 'Must See'
                const isFree = tag === 'Free'
                return (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isPopular
                        ? 'bg-amber/15 text-amber border border-amber/30'
                        : isFree
                        ? 'bg-teal/15 text-teal border border-teal/30'
                        : 'bg-white text-text-secondary border border-gray-200'
                    }`}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          )}

          {/* Location */}
          <div>
            <h3 className="text-text-primary font-heading font-semibold text-sm mb-2">Location</h3>
            <div className="bg-white rounded-[12px] overflow-hidden shadow-card">
              {/* Map placeholder */}
              {item.latitude && item.longitude ? (
                <div className="h-32 bg-gradient-to-br from-teal/5 to-navy/5 relative flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-teal/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                      </svg>
                    </div>
                    <p className="text-[10px] text-text-muted">{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</p>
                  </div>
                </div>
              ) : (
                <div className="h-20 bg-gray-50 flex items-center justify-center">
                  <p className="text-text-muted text-xs">Map location coming soon</p>
                </div>
              )}
              <div className="p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary text-xs font-medium truncate">{item.address || 'Location available'}</p>
                </div>
                <button
                  onClick={handleDirections}
                  className="text-teal text-xs font-medium hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
                >
                  Get Directions
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Hours / Tip */}
          {(item.hours || item.tip) && (
            <div className="space-y-3">
              {item.hours && (
                <div className="bg-white rounded-[12px] p-4 shadow-card border-l-4 border-teal">
                  <p className="text-xs font-body text-text-primary">
                    <span className="font-semibold">🕐 Hours:</span> {item.hours}
                  </p>
                </div>
              )}
              {item.tip && (
                <div className="bg-white rounded-[12px] p-4 shadow-card border-l-4 border-amber">
                  <p className="text-xs font-body text-text-primary">
                    <span className="font-semibold">💡 Pro tip:</span> {item.tip}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleBook}
            disabled={!item.booking_url}
          >
            {item.booking_url ? 'Book a Table →' : 'No booking available'}
          </Button>
        </div>
      </div>
    </div>
  )
}