import { useState } from 'react'
import { cn } from '../../lib/utils'

/**
 * PremiumUpsell — A friendly, local-friend-toned upsell modal.
 * Appears at natural moments (after itinerary generation, at save limits).
 * Feels like a recommendation, not a pushy sales pitch.
 *
 * Props:
 * - trigger: 'results' | 'save' | 'offline' — context for the copy
 * - onClose: () => void
 * - onUpgrade: () => void (placeholder for payment flow)
 */
export default function PremiumUpsell({ trigger = 'results', onClose, onUpgrade }) {
  const [billing, setBilling] = useState('monthly')

  const headlines = {
    results: "You're going places. Go Premium.",
    save: 'Save every adventure.',
    offline: 'Take your vibe offline.',
  }

  const subtitles = {
    results: "You've tasted the magic. Ready for unlimited adventures?",
    save: 'Keep all your itineraries in one place. Forever.',
    offline: 'No signal? No problem. Your plans travel with you.',
  }

  const features = [
    {
      free: '3 itineraries / month',
      premium: 'Unlimited itineraries',
      icon: '🗺️',
    },
    {
      free: 'Online only',
      premium: 'Offline access',
      icon: '📡',
    },
    {
      free: 'Basic recommendations',
      premium: 'AI-optimized routes',
      icon: '✨',
    },
    {
      free: 'Email support',
      premium: 'Priority support',
      icon: '💬',
    },
    {
      free: 'Single city',
      premium: 'All cities + global',
      icon: '🌍',
    },
  ]

  const prices = {
    monthly: { label: 'Monthly', price: '$9.99', period: '/month' },
    yearly: { label: 'Yearly', price: '$79.99', period: '/year', badge: 'Save 33%' },
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-sand rounded-t-[20px] md:rounded-[20px] w-full max-w-md mx-auto shadow-2xl animate-slide-up overflow-y-auto max-h-[90vh]">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-text-secondary hover:text-text-primary transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-6 pt-8 pb-8">
          {/* Header section with gradient */}
          <div className="text-center mb-8">
            {/* Decorative icon */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal via-teal to-violet flex items-center justify-center shadow-lg shadow-teal/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>

            <h2 className="text-text-primary font-heading font-bold text-2xl mb-2">
              {headlines[trigger]}
            </h2>
            <p className="text-text-secondary text-sm font-body max-w-xs mx-auto">
              {subtitles[trigger]}
            </p>
          </div>

          {/* Feature comparison */}
          <div className="bg-white rounded-[16px] p-5 mb-6 shadow-card">
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="col-span-1" />
              <div className="text-xs font-heading font-semibold text-text-muted uppercase tracking-wider">
                Free
              </div>
              <div className="text-xs font-heading font-semibold text-teal uppercase tracking-wider">
                Premium
              </div>
            </div>
            <div className="space-y-3">
              {features.map((feat, i) => (
                <div key={i} className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2 col-span-1">
                    <span className="text-base">{feat.icon}</span>
                    <span className="text-xs text-text-secondary font-body sr-only md:not-sr-only">
                      {feat.free.split(' ').slice(1).join(' ')}
                    </span>
                  </div>
                  <div className="text-xs text-text-muted font-body">{feat.free}</div>
                  <div className="text-xs text-teal font-body font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {feat.premium}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing toggle */}
          <div className="flex bg-gray-100 rounded-[12px] p-1 mb-4">
            {Object.entries(prices).map(([key, plan]) => (
              <button
                key={key}
                onClick={() => setBilling(key)}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-[10px] text-sm font-medium font-body transition-all cursor-pointer relative',
                  billing === key
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {plan.label}
                {plan.badge && (
                  <span className="absolute -top-2 -right-1 bg-coral text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {plan.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Price display */}
          <div className="text-center mb-6">
            <span className="text-4xl font-heading font-bold text-text-primary">
              {prices[billing].price}
            </span>
            <span className="text-text-secondary text-sm font-body ml-1">
              {prices[billing].period}
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={onUpgrade}
            className="w-full py-3.5 rounded-[12px] bg-gradient-to-r from-teal to-violet text-white font-body font-semibold text-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-teal/20"
          >
            Make it yours →
          </button>

          {/* Trust builder */}
          <p className="text-text-muted text-[10px] text-center mt-4 font-body">
            Cancel anytime. No questions asked.
          </p>

          {/* Continue free link */}
          <button
            onClick={onClose}
            className="w-full text-center text-text-secondary text-xs font-body mt-3 hover:text-text-primary transition-colors cursor-pointer"
          >
            I'll stick with free for now
          </button>
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