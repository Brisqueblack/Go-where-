import { useState, useEffect } from 'react'
import { Button, ChipGroup } from '../components/ui'

const EXPANSION_CITIES = [
  // Original 5
  { name: 'Boston', icon: '🗺️', gem: "Bova's Bakery at midnight", slug: 'boston', color: 'from-teal/20 to-coral/10' },
  { name: 'Philadelphia', icon: '🔔', gem: 'Secret gas-lit alley in Society Hill', slug: 'philadelphia', color: 'from-coral/20 to-navy/10' },
  { name: 'Washington D.C.', icon: '🏛️', gem: 'Tidal Basin at dawn, no crowds', slug: 'dc', color: 'from-violet/20 to-teal/10' },
  { name: 'Chicago', icon: '🌊', gem: 'Hidden lily pond in Lincoln Park', slug: 'chicago', color: 'from-teal/20 to-violet/10' },
  { name: 'Miami', icon: '🌴', gem: 'Hand-rolled cigars in Little Havana', slug: 'miami', color: 'from-coral/20 to-teal/10' },
  // 7 New Cities
  { name: 'Los Angeles', icon: '🎬', gem: 'Sunset at the Griffith, no filter needed', slug: 'los-angeles', color: 'from-amber/20 to-coral/10' },
  { name: 'Las Vegas', icon: '🎰', gem: 'Neon Museum after dark, pure magic', slug: 'las-vegas', color: 'from-violet/20 to-amber/10' },
  { name: 'Orlando', icon: '🚀', gem: 'Winter Park — parks, not theme parks', slug: 'orlando', color: 'from-teal/20 to-emerald/10' },
  { name: 'San Francisco', icon: '🌉', gem: 'Mission District murals & burritos', slug: 'san-francisco', color: 'from-coral/20 to-amber/10' },
  { name: 'Seattle', icon: '☕', gem: 'Ferry to Bainbridge for skyline views', slug: 'seattle', color: 'from-violet/20 to-teal/10' },
  { name: 'Nashville', icon: '🎸', gem: 'The Bluebird Cafe at sunset', slug: 'nashville', color: 'from-amber/20 to-violet/10' },
  { name: 'Austin', icon: '🎵', gem: 'Barton Springs on a 100°F day', slug: 'austin', color: 'from-teal/20 to-amber/10' },
]

const VIBE_OPTIONS = [
  { value: 'date-night', label: '🌆 Date Night' },
  { value: 'solo', label: '🏙️ Solo Explorer' },
  { value: 'family', label: '👨‍👩‍👧‍👦 Family Fun' },
  { value: 'outdoor', label: '🌿 Outdoor' },
  { value: 'culture', label: '🎨 Culture' },
  { value: 'foodie', label: '🍽️ Foodie' },
  { value: 'nightlife', label: '🌙 Nightlife' },
  { value: 'shopping', label: '🛍️ Shopping' },
  { value: 'wellness', label: '🧘 Wellness' },
  { value: 'adventure', label: '⚡ Adventure' },
]

export default function HomePage({ onNavigate, preferences, setPreferences }) {
  const [location, setLocation] = useState(preferences.location || '')
  const [selectedVibes, setSelectedVibes] = useState(preferences.vibes || [])
  const [showHint, setShowHint] = useState(() => {
    return localStorage.getItem('vibevoyage_seen_hint') !== 'true'
  })

  // Dismiss hint on first interaction
  useEffect(() => {
    if (showHint && (location.trim() || selectedVibes.length > 0)) {
      setShowHint(false)
      localStorage.setItem('vibevoyage_seen_hint', 'true')
    }
  }, [location, selectedVibes, showHint])

  const handleStartPlanning = () => {
    setPreferences((prev) => ({
      ...prev,
      location,
      vibes: selectedVibes,
    }))
    onNavigate('input')
  }

  const isReady = location.trim().length > 0 || selectedVibes.length > 0

  return (
    <div className="min-h-screen flex flex-col bg-navy relative overflow-hidden">
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'url(/brand-pattern.png)', backgroundSize: '400px' }}
      />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-coral/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content - padding bottom for nav bar */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pb-24 pt-16">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <img src="/logo-icon.png" alt="VibeVoyage AI" className="w-14 h-14" />
        </div>

        {/* Horizontal lockup */}
        <div className="mb-4 flex justify-center">
          <img src="/logo-horizontal.png" alt="VibeVoyage AI" className="h-9 md:h-10" />
        </div>

        {/* Primary Tagline */}
        <h1 className="text-2xl md:text-3xl text-white font-heading font-bold text-center mb-2 leading-tight max-w-md">
          Tell Us Your Mood.
          <br />
          <span className="text-teal">We'll Plan The Day.</span>
        </h1>
        <p className="text-text-muted text-center text-sm md:text-base max-w-sm mb-8 leading-relaxed">
          What's your mood today? Tell us and we'll curate the perfect experience.
        </p>

        {/* Vibe Chips — horizontal scroll */}
        <div className="w-full max-w-md mb-6">
          <p className="text-violet/70 text-xs font-medium font-body mb-3 uppercase tracking-wider">
            What's your vibe today?
          </p>
          <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
            <div className="flex gap-2 min-w-max">
              <ChipGroup
                options={VIBE_OPTIONS}
                value={selectedVibes}
                onChange={setSelectedVibes}
                multi={true}
              />
            </div>
          </div>
        </div>

        {/* Location Input */}
        <div className="w-full max-w-md mb-8">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where do you want to explore?"
              className="w-full pl-11 pr-4 py-3 rounded-[8px] bg-white/10 border-2 border-white/20 text-white placeholder:text-text-muted focus:outline-none focus:border-teal transition-colors text-sm font-body"
            />
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          disabled={!isReady}
          onClick={handleStartPlanning}
          className="w-full max-w-md"
        >
          Find My Vibe ✨
        </Button>

        {/* First-visit onboarding hint */}
        {showHint && !isReady && (
          <div className="mt-3 animate-fade-in">
            <div className="relative bg-white/10 text-white/80 text-xs font-body px-4 py-2.5 rounded-lg text-center max-w-xs mx-auto border border-white/10">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/10 rotate-45 border-t border-l border-white/10" />
              Pick a mood or enter a city to get started ✨
            </div>
          </div>
        )}

        {/* Disabled-state helper text */}
        {!showHint && !isReady && (
          <p className="mt-3 text-text-muted/60 text-xs font-body text-center animate-fade-in">
            Pick a mood or enter a city to get started ✨
          </p>
        )}

        {/* 12-City Expansion Section */}
        <div className="w-full max-w-2xl mt-14 mb-4">
          {/* Section header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 border border-white/10">
              <span className="text-xs">🌎</span>
              <span className="text-teal text-xs font-semibold font-body uppercase tracking-wider">
                Now Live
              </span>
            </div>
            <h2 className="text-white font-heading font-bold text-xl mt-3 leading-tight">
              12 Cities. <span className="text-teal">Endless Hidden Gems.</span>
            </h2>
            <p className="text-text-muted text-sm mt-1 max-w-sm mx-auto">
              Your local friend has arrived in twelve cities — and knows the spots nobody else does.
            </p>
          </div>

          {/* City cards — responsive grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {EXPANSION_CITIES.map((city) => (
              <div
                key={city.slug}
                className="group relative bg-white/5 rounded-xl p-4 border border-white/10 hover:border-teal/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/5"
              >
                {/* Gradient accent */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${city.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                {/* City icon */}
                <div className="relative text-2xl mb-2">{city.icon}</div>

                {/* City name */}
                <h3 className="relative text-white font-heading font-semibold text-sm leading-tight">
                  {city.name}
                </h3>

                {/* Hidden gem teaser */}
                <p className="relative text-text-muted text-xs mt-1 leading-relaxed line-clamp-2">
                  {city.gem}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom tagline */}
          <p className="text-center text-text-muted/60 text-xs mt-5 font-body">
            Tell us your mood. We'll plan the day — in any of these cities.
          </p>
        </div>
      </div>
    </div>
  )
}