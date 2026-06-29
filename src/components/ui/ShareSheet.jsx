import { useState, useCallback } from 'react'
import { cn } from '../../lib/utils'

/**
 * ShareSheet — A brand-aligned sharing modal for itineraries.
 * Opens as an overlay with share preview + platform buttons.
 */
export default function ShareSheet({ itinerary, onClose }) {
  const [copied, setCopied] = useState(false)
  const items = itinerary?.days?.[0]?.items || []

  // Build a shareable text summary
  const buildShareText = useCallback(() => {
    const title = itinerary?.title || 'My VibeVoyage'
    const activities = items.map((item, i) => `${i + 1}. ${item.name}`).join('\n')
    const total = itinerary?.total_estimated_cost
    const costLine = total ? `💰 Estimated total: $${total}` : ''
    return `✨ ${title} ✨\n\n${activities}\n\n${costLine}\n\nTell us your mood. We'll plan the day. → Try VibeVoyage AI`
  }, [itinerary, items])

  const shareText = buildShareText()
  const encodedText = encodeURIComponent(shareText)
  const encodedUrl = encodeURIComponent('https://vibevoyage.ai')

  const platforms = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      color: 'bg-[#25D366] hover:brightness-110',
      icon: WhatsappIcon,
      url: `https://wa.me/?text=${encodedText}%0A${encodedUrl}`,
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      color: 'bg-[#000000] hover:brightness-150',
      icon: XIcon,
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      id: 'copy',
      name: copied ? 'Copied!' : 'Copy Link',
      color: 'bg-violet hover:brightness-110',
      icon: CopyIcon,
      action: () => {
        navigator.clipboard.writeText(`${shareText}\n\nhttps://vibevoyage.ai`).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      },
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-sand rounded-t-[20px] md:rounded-[20px] w-full max-w-md mx-auto shadow-2xl animate-slide-up overflow-hidden">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-text-secondary hover:text-text-primary transition-all cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-6 pb-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-text-primary font-heading font-bold text-xl mb-1">
              Share Your Vibe 🎉
            </h2>
            <p className="text-text-secondary text-sm font-body">
              Let your friends steal your vibe.
            </p>
          </div>

          {/* Share Preview Card */}
          <div className="bg-gradient-to-br from-navy via-navy to-violet/30 rounded-[16px] p-5 mb-6 shadow-lg">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-3">
              <img src="/logo-icon.png" alt="VibeVoyage AI" className="w-6 h-6" />
              <span className="text-white/60 text-[10px] font-body font-medium tracking-wide uppercase">
                VibeVoyage AI
              </span>
            </div>

            {/* Itinerary title */}
            <h3 className="text-white font-heading font-bold text-lg mb-2">
              {itinerary?.title || 'My VibeVoyage'}
            </h3>

            {/* Activity preview — first 3 items */}
            <div className="space-y-1.5 mb-3">
              {items.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-teal text-[9px] font-bold">{i + 1}</span>
                  </div>
                  <span className="text-white/80 text-xs font-body truncate">{item.name}</span>
                  {item.estimated_cost !== undefined && (
                    <span className="text-text-muted text-[10px] ml-auto flex-shrink-0">
                      {item.estimated_cost === 0 ? 'Free' : `$${item.estimated_cost}`}
                    </span>
                  )}
                </div>
              ))}
              {items.length > 3 && (
                <p className="text-text-muted text-[10px] font-body pl-7">
                  +{items.length - 3} more stops
                </p>
              )}
            </div>

            {/* Total and tagline */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <span className="text-white font-heading font-bold text-sm">
                ${itinerary?.total_estimated_cost || 0} total
              </span>
              <span className="text-teal text-[10px] font-body text-right max-w-[140px] leading-tight">
                Tell us your mood. We'll plan the day. ✨
              </span>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-3">
            {platforms.map((platform) => {
              const Icon = platform.icon
              return (
                <a
                  key={platform.id}
                  href={platform.url || '#'}
                  onClick={(e) => {
                    if (platform.action) {
                      e.preventDefault()
                      platform.action()
                    }
                  }}
                  target={platform.url ? '_blank' : undefined}
                  rel={platform.url ? 'noopener,noreferrer' : undefined}
                  className={cn(
                    'flex items-center gap-4 w-full px-5 py-3.5 rounded-[12px] text-white font-body font-medium text-sm transition-all cursor-pointer',
                    platform.color
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{platform.name}</span>
                  {platform.id === 'copy' && (
                    <span className="ml-auto text-white/70 text-xs">
                      {copied ? '✓' : '📋'}
                    </span>
                  )}
                </a>
              )
            })}
          </div>

          {/* Footer */}
          <p className="text-text-muted text-[10px] text-center mt-6 font-body">
            VibeVoyage AI — Never wonder what to do again.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

// ─── Social Icon Components ───

function WhatsappIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function CopyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  )
}