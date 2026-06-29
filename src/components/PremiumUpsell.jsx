/**
 * PremiumUpsell.jsx
 * Contextual modal that appears on the results page encouraging Premium upgrade.
 * "Unlock hidden gems" — friendly, not pushy.
 */

import { Button } from './ui'

export default function PremiumUpsell({ onGoPremium, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 px-4 pb-20 md:pb-0">
      <div className="bg-white rounded-[16px] p-6 max-w-sm w-full shadow-xl animate-fade-in">
        {/* Sparkle icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-amber to-coral rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </div>

        <h2 className="font-heading font-bold text-text-primary text-lg text-center mb-1">
          Unlock Hidden Gems ✨
        </h2>
        <p className="text-text-secondary text-sm text-center mb-6">
          Go Premium for unlimited itineraries, offline maps, and secret local spots you won't find anywhere else.
        </p>

        {/* Benefits preview */}
        <div className="space-y-2 mb-6">
          {[
            'Unlimited AI itineraries',
            'Offline access & maps',
            'Priority AI processing',
            'Cancel anytime',
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
              <svg className="w-4 h-4 text-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {benefit}
            </div>
          ))}
        </div>

        <Button variant="primary" className="w-full mb-2" onClick={onGoPremium}>
          Go Premium — $9.99/mo
        </Button>
        <button onClick={onDismiss} className="w-full text-center text-sm text-text-muted hover:text-teal cursor-pointer">
          Maybe later
        </button>
      </div>
    </div>
  )
}