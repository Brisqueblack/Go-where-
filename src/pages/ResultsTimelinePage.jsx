import { useState } from 'react'
import { Button, TimelineContainer, TimelineItem, ActivityCard, ShareSheet, PremiumUpsell } from '../components/ui'

/**
 * Results — Timeline View (Screen 4)
 * Presents the curated itinerary as a scannable vertical timeline.
 */
export default function ResultsTimelinePage({ itinerary, onBack, onViewDetail, onToggleView, onGoPremium }) {
  const [showShare, setShowShare] = useState(false)
  const [showPremium, setShowPremium] = useState(false)
  const items = itinerary?.days?.[0]?.items || []
  const total = itinerary?.total_estimated_cost || 0

  // Generate time labels for activities
  const getTimeForSlot = (slot, index) => {
    const times = {
      morning: ['9:00 AM', '11:00 AM'],
      afternoon: ['1:00 PM', '3:00 PM'],
      evening: ['6:00 PM'],
    }
    return times[slot]?.[index] || `${9 + index * 2}:00 AM`
  }

  // Get the time for each item based on slot
  const slotCounts = {}
  const itemsWithTime = items.map((item, idx) => {
    const slot = item.time_slot || 'morning'
    slotCounts[slot] = (slotCounts[slot] || 0) + 1
    const slotIndex = slotCounts[slot] - 1
    return { ...item, displayTime: getTimeForSlot(slot, slotIndex), index: idx }
  })

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <h3 className="text-text-primary font-heading font-semibold text-lg mb-2">
            No results found
          </h3>
          <p className="text-text-secondary text-sm mb-6">
            We couldn't find the perfect plan. Try different preferences?
          </p>
          <Button variant="secondary" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand flex flex-col">
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
            className="flex-1 py-2.5 text-xs font-medium font-body text-teal border-b-2 border-teal transition-colors cursor-pointer"
          >
            Timeline
          </button>
          <button
            onClick={() => onToggleView?.('map')}
            className="flex-1 py-2.5 text-xs font-medium font-body text-text-muted hover:text-white border-b-2 border-transparent transition-colors cursor-pointer"
          >
            Map
          </button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto px-4 pt-6">
          {itinerary?.notes && (
            <div className="bg-amber/10 border border-amber/20 rounded-[12px] p-4 mb-6">
              <p className="text-amber text-xs font-body leading-relaxed">{itinerary.notes}</p>
            </div>
          )}

          <TimelineContainer>
            {itemsWithTime.map((item) => (
              <TimelineItem key={item.index} time={item.displayTime}>
                <ActivityCard
                  title={item.name}
                  rating={item.rating}
                  price={item.estimated_cost}
                  duration={item.duration}
                  tags={item.tags}
                  category={item.category}
                  isHiddenGem={item.is_hidden_gem}
                  onClick={() => onViewDetail?.(item)}
                />
              </TimelineItem>
            ))}
          </TimelineContainer>

          {/* Subtle Premium upsell banner */}
          <div className="mt-8 mb-4">
            <button
              onClick={() => onGoPremium?.()}
              className="w-full flex items-center justify-between bg-gradient-to-r from-teal/5 to-violet/5 border border-teal/20 rounded-[12px] p-4 hover:from-teal/10 hover:to-violet/10 transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-violet flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-text-primary font-body font-semibold text-sm">Go Premium ✨</p>
                  <p className="text-text-muted text-[11px] font-body">Unlimited itineraries, offline access & more</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-text-muted group-hover:text-teal transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-text-secondary text-xs font-body">Estimated total</p>
            <p className="text-text-primary font-heading font-bold text-lg">
              ${total}
            </p>
          </div>
          <Button variant="primary" size="md">
            Lock In Your Vibe →
          </Button>
        </div>
      </div>

      {/* Share Sheet */}
      {showShare && (
        <ShareSheet itinerary={itinerary} onClose={() => setShowShare(false)} />
      )}
      {showPremium && (
        <PremiumUpsell trigger="results" onClose={() => setShowPremium(false)} onUpgrade={() => {}} />
      )}
    </div>
  )
}