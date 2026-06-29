/**
 * PremiumPage.jsx
 * VibeVoyage Premium — benefits landing page
 * Showcases the value prop of going Premium with real Stripe payment links.
 */

import { Button } from '../components/ui'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '5 AI itineraries per month',
      'Basic recommendations',
      'Standard response time',
    ],
    cta: 'Current plan',
    popular: false,
  },
  {
    id: 'premium-monthly',
    name: 'VibeVoyage Premium',
    price: 9.99,
    period: '/month',
    features: [
      'Unlimited AI itineraries',
      'Offline access & maps',
      'Priority AI processing',
      'Hidden gems & local secrets',
      'Export to PDF / share link',
      'Cancel anytime',
    ],
    cta: 'Start Free Trial',
    popular: true,
    stripeUrl: 'https://buy.stripe.com/cNibJ0h1QgeK9RBaEz67S00',
  },
  {
    id: 'premium-yearly',
    name: 'Premium Annual',
    price: 79.99,
    period: '/year',
    features: [
      'Everything in Monthly',
      '2 months free',
      'Early access to new features',
      'VIP support',
    ],
    cta: 'Go Annual — Save 33%',
    popular: false,
    badge: 'Best Value',
    stripeUrl: 'https://buy.stripe.com/bJe28q4f4aUq7JtaEz67S01',
  },
]

export default function PremiumPage({ isPremium, onUpgrade, onBack }) {
  const handleUpgrade = (plan) => {
    if (plan.stripeUrl) {
      // Open Stripe checkout in new tab
      window.open(plan.stripeUrl, '_blank', 'noopener,noreferrer')
      // Optimistically upgrade the local state so user sees Premium features immediately
      onUpgrade?.(plan.id)
    }
  }

  // Already Premium
  if (isPremium) {
    return (
      <div className="min-h-screen bg-sand flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-[12px] p-8 shadow-card max-w-md text-center">
          <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h2 className="font-heading font-bold text-text-primary text-xl mb-2">You're Premium! 🎉</h2>
          <p className="text-text-secondary text-sm mb-6">Enjoy unlimited itineraries and all premium features.</p>
          <Button variant="secondary" onClick={onBack}>Back to Home</Button>
        </div>
      </div>
    )
  }

  // Main plans page
  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 h-14 max-w-4xl mx-auto">
          <button onClick={onBack} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
            <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="font-heading font-semibold text-text-primary">VibeVoyage Premium</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-amber to-coral rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </div>
          <h2 className="font-heading font-bold text-text-primary text-2xl mb-2">Unlock the full experience</h2>
          <p className="text-text-secondary text-sm max-w-sm mx-auto">
            Unlimited AI itineraries, offline access, hidden gems, and more.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-[12px] p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover ${
                plan.popular ? 'ring-2 ring-teal md:-mt-2 md:mb-2' : ''
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber text-white text-[10px] font-bold rounded-full">
                  {plan.badge}
                </div>
              )}
              {plan.popular && !plan.badge && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-teal text-white text-[10px] font-bold rounded-full">
                  Popular
                </div>
              )}
              <h3 className="font-heading font-semibold text-text-primary text-lg">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-text-primary">${plan.price}</span>
                {plan.period && <span className="text-text-muted text-sm">{plan.period}</span>}
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <svg className="w-4 h-4 text-teal shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                disabled={plan.id === 'free'}
                onClick={() => handleUpgrade(plan)}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}