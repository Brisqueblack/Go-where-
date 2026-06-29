import { useState } from 'react'
import { ActivityCard, ShareSheet } from '../components/ui'

/**
 * Results — Map View (Screen 6)
 * Spatial view of the itinerary route with numbered pins and bottom sheet.
 */
export default function ResultsMapPage({ itinerary, onBack, onToggleView, onViewDetail }) {
  const items = itinerary?.days?.[0]?.items || []
  const [activeIndex, setActiveIndex] = useState(0)
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const [showShare, setShowShare] = useState(false)

  const activeItem = items[activeIndex]

  // Get time for display
  const getTimeForSlot = (slot, index) => {
    const times = {
      morning: ['9:00 AM', '11:00 AM'],
      afternoon: ['1:00 PM', '3:00 PM'],
      evening: ['6:00 PM'],
    }
    return times[slot]?.[index] || ''
  }

  const slotCounts = {}
  const itemsWithTime = items.map((item, idx) => {
    const slot = item.time_slot || 'morning'
    slotCounts[slot] = (slotCounts[slot] || 0) + 1
    const slotIndex = slotCounts[slot] - 1
    return { ...item, displayTime: getTimeForSlot(slot, slotIndex), index: idx }
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-8">
        <div className="text-center text-white">
          <p className="text-text-muted mb-4">We couldn't map these locations</p>
          <button onClick={() => onToggleView?.('timeline')} className="text-teal underline text-sm cursor-pointer">
            Try timeline view instead
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-navy z-20">
        <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Back"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-white font-heading font-semibold text-sm leading-tight">
                {itinerary?.title ? `Your VibeVoyage • ${itinerary.title}` : 'Your VibeVoyage'}
              </h1>
              <p className="text-text-muted text-[11px] font-body">Saturday, June 24</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowShare(true)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer" aria-label="Share">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
          </div>
        </div>
        {/* View Toggle */}
        <div className="flex border-t border-white/10 px-4 max-w-4xl mx-auto w-full">
          <button
            onClick={() => onToggleView?.('timeline')}
            className="flex-1 py-2.5 text-xs font-medium font-body text-text-muted hover:text-white border-b-2 border-transparent transition-colors cursor-pointer"
          >
            Timeline
          </button>
          <button
            onClick={() => onToggleView?.('map')}
            className="flex-1 py-2.5 text-xs font-medium font-body text-teal border-b-2 border-teal transition-colors cursor-pointer"
          >
            Map
          </button>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Map placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-teal/5 to-navy">
          {/* Grid pattern for map feel */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#0A9B8C 1px, transparent 1px), linear-gradient(90deg, #0A9B8C 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Dotted route line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 500" preserveAspectRatio="xMidYMid meet">
            <path
              d="M120,80 C180,150 200,200 280,220 C320,230 250,300 200,350 C150,400 180,430 250,440"
              fill="none"
              stroke="#0A9B8C"
              strokeWidth="2"
              strokeDasharray="6,4"
              opacity="0.6"
            />
          </svg>

          {/* Numbered map pins */}
          {itemsWithTime.map((item, idx) => {
            const positions = [
              { x: '28%', y: '12%' },
              { x: '62%', y: '38%' },
              { x: '48%', y: '62%' },
              { x: '20%', y: '72%' },
              { x: '55%', y: '85%' },
            ]
            const pos = positions[idx] || { x: '50%', y: `${10 + idx * 20}%` }
            const isActive = idx === activeIndex

            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{ left: pos.x, top: pos.y }}
                aria-label={item.name}
              >
                {/* Pin shadow */}
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full bg-black/20 transition-all duration-200 ${isActive ? 'scale-150' : ''}`} />
                {/* Pin */}
                <div
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold font-body shadow-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-teal text-white scale-125 ring-4 ring-teal/30'
                      : 'bg-teal text-white hover:scale-110'
                  }`}
                >
                  {idx + 1}
                </div>
                {/* Label */}
                <p className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] whitespace-nowrap font-medium px-2 py-0.5 rounded transition-all duration-200 ${
                  isActive ? 'bg-teal/20 text-teal' : 'bg-navy/80 text-text-muted'
                }`}>
                  {item.name.length > 20 ? item.name.slice(0, 18) + '...' : item.name}
                </p>
              </button>
            )
          })}

          {/* "Map" watermark */}
          <div className="absolute bottom-4 right-4 bg-navy/70 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white/40 text-[10px] font-body">
            Map view • Google Maps SDK coming soon
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        className={`relative z-20 bg-white rounded-t-[20px] transition-all duration-300 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] ${
          sheetExpanded ? 'h-[50vh]' : ''
        }`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="w-10 h-1 rounded-full bg-gray-300 cursor-pointer"
            onClick={() => setSheetExpanded(!sheetExpanded)}
          />
        </div>

        {/* Sheet content */}
        <div className="px-4 pb-6">
          {activeItem && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-teal text-white text-[10px] font-bold">
                  {activeIndex + 1}
                </div>
                <p className="text-text-muted text-xs font-body">
                  {activeItem.displayTime} · {items.length - activeIndex - 1} more stops
                </p>
              </div>

              <ActivityCard
                title={activeItem.name}
                rating={activeItem.rating}
                price={activeItem.estimated_cost}
                duration={activeItem.duration}
                tags={activeItem.tags}
                variant="timeline"
                onClick={() => onViewDetail?.(activeItem)}
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    if (activeItem.latitude && activeItem.longitude) {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${activeItem.latitude},${activeItem.longitude}`,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  }}
                  className="flex-1 py-2.5 rounded-[8px] border-2 border-teal text-teal text-sm font-medium font-body hover:bg-teal/10 transition-colors cursor-pointer"
                >
                  Get Directions
                </button>
                <button
                  onClick={() => onViewDetail?.(activeItem)}
                  className="flex-1 py-2.5 rounded-[8px] bg-coral text-white text-sm font-medium font-body hover:brightness-90 transition-all cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Sheet */}
      {showShare && (
        <ShareSheet itinerary={itinerary} onClose={() => setShowShare(false)} />
      )}
    </div>
  )
}